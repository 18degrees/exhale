import { NextRequest } from "next/server"
import exifr from 'exifr'
import fs from 'fs/promises'
import convert from 'heic-convert'
import { Octokit } from "@octokit/core"
import { getServerSession } from "next-auth"
import { authConfig } from "@/app/configs/auth"
import { IDBPhoto, IPhoto, orientation } from "@/app/interfaces/photo.interface"
import nano from "nano"

const exifremove = require('exifremove')

const DB_URI = process.env.COUCHDB_URI!

export async function GET(req: NextRequest) {
    try {
        const id = req.headers.get('id')
        
        if (!id) return Response.json({message: 'The ID of the photo is missing'}, {status: 400})
            
            const nanoServer = nano(DB_URI)
            
            const photoDB: nano.DocumentScope<IDBPhoto> = nanoServer.db.use('exhale-photos')
            
            const {createDate, offsetTime, latitude, longitude, tags, title, width, height} = await photoDB.get(id)
            
            const local = createDate && offsetTime ? getLocalTime(createDate, offsetTime) : undefined

            const createDateMask = local?.date ? getDateString(local.date) : undefined

            const googleMapLink = latitude && longitude ? `https://www.google.com/maps/dir//${latitude},${longitude}/@${latitude},${longitude},13z` : undefined
            
            return Response.json({createDateMask, googleMapLink, tags, title, width, height})
        } catch (error) {
        console.log(error)
        return Response.json({message: 'Server error. Try again later'}, {status: 500})
    }
}

function getLocalTime(initialDateStr: string, offset: string) {
    const offsetNumber = Number(offset.slice(0, 3))

    const localeDate = new Date(initialDateStr)

    localeDate.setUTCHours(localeDate.getUTCHours() + offsetNumber)

    const day = String(localeDate.getUTCDate())
    const month = String(localeDate.getUTCMonth() + 1)
    const year = localeDate.getUTCFullYear()

    const minute = String(localeDate.getUTCMinutes())
    const hour = String(localeDate.getUTCHours())

    const date = `${day.length === 1 ? '0' + day : day}.${month.length === 1 ? '0' + month : month}.${year}`
    
    const time = `${hour.length === 1 ? '0' + hour : hour}:${minute.length === 1 ? '0' + minute : minute}`

    return {date, time}
}
function getDateString(date: string) {
    const [day, m, year] = date.split('.')

    const monthStage = +day <= 10 ? 'начале' : +day <= 20 ? 'середине' : 'конце'

    const month = (
        m === '01' ? 'января' :
        m === '02' ? 'февраля' :
        m === '03' ? 'марта' :
        m === '04' ? 'апреля' :
        m === '05' ? 'мая' :
        m === '06' ? 'июня' :
        m === '07' ? 'июля' :
        m === '08' ? 'августа' :
        m === '09' ? 'сентября' :
        m === '10' ? 'октября' :
        m === '11' ? 'ноября' : 'декабря'
    )

    return `в ${monthStage} ${month} ${year}`
}

interface IPOSTBody {
    title: any
    tags: any
    include: {
        createDate: any
        coordinates: any
        camera: any
    }
    base64URL: any
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig)

        if (!session) {
            return Response.json({ message: 'You must be logged in' }, {status: 401})
        }

        const body: IPOSTBody = await req.json()

        const {base64URL, ...initialMetadata} = getReqData(body)
        
        if (!base64URL) return Response.json({ message: 'The photo is missing' }, {status: 400})

        const additionTimestamp = Date.now().toString()

        const isHeic = base64URL.includes('application/octet-stream')
        
        const base64 = base64URL.split('base64,')[1]

        const buffer = Buffer.from(base64, 'base64')

        const exifMetadata = await getExifMetadata(buffer, initialMetadata.include)

        if (!exifMetadata?.width || !exifMetadata?.height || typeof exifMetadata?.orientation !== 'number') {
            return Response.json({ message: 'The necessary metadata information is missing: width, height or orientation' }, {status: 400})
        }

        //convertHeicToJpeg deletes exif automatically; if image JPEG - remove it manually
        const jpegImageWithoutExif = isHeic ? await convertHeicToJpeg(buffer) : exifremove.remove(buffer)

        await saveJpegPhoto(jpegImageWithoutExif, additionTimestamp)

        await saveMetadata(exifMetadata, initialMetadata, additionTimestamp)

        triggerUpdateAction()

        return Response.json({message: 'The photo has been saved'}, {status: 201})
        
    } catch (error) {
        console.log(error)
        return Response.json({message: 'Server error. Try again later'}, {status: 500})
    }
}
function getReqData(body: IPOSTBody) {
    const {title: titleRough, tags: tagsRough, base64URL: base64URLRough} = body

    const title = typeof titleRough === 'string' ? titleRough.trim() : undefined
    const tags = typeof tagsRough === 'string' ? tagsRough.trim() : undefined
    const base64URL = typeof base64URLRough === 'string' && base64URLRough.startsWith('data:') ? base64URLRough.trim() : undefined

    const include = {
        createDate: body.include.createDate === true,
        coordinates: body.include.coordinates === true,
        camera: body.include.camera === true
    }

    return {
        title,
        tags,
        base64URL,
        include
    }
}

interface IExifMeta {
    camera?: string
    longitude?: number
    latitude?: number

    height?: number,
    width?: number
    
    createDate?: string
    offsetTime?: string
    
    orientation?: orientation
}

async function getExifMetadata(photo: Buffer, include: {createDate: boolean, coordinates: boolean, camera: boolean}): Promise<IExifMeta> {
    try {
        const {
            Model: camera, 
            latitude, longitude, 
            Orientation: orientation, 
            CreateDate: createDate,
            OffsetTime: offsetTime,
            ExifImageWidth,
            ExifImageHeight
        } = await exifr.parse(photo, {
            pick: [
                'Model', 
                'Orientation', 
                'CreateDate', 'OffsetTime', 
                'GPSLatitude', 'GPSLongitude',
                'ExifImageWidth', 'ExifImageHeight'
            ],
            translateValues: false
        })
        const height = orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8 || orientation === 0 ? ExifImageWidth : ExifImageHeight
        const width = orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8 || orientation === 0 ? ExifImageHeight : ExifImageWidth

        return { 
            camera: include.camera ? camera : undefined, 
            orientation, 
            latitude: include.coordinates ? latitude : undefined, 
            longitude: include.coordinates ? longitude : undefined, 
            createDate: include.createDate ? createDate : undefined, 
            offsetTime: include.createDate ? offsetTime : undefined, 
            height, 
            width
        }
    } catch (error) {
        console.log('Error occured during extracting the image metadata. The photo could be saved without meta info\n', error)

        return {}
    }
}
async function convertHeicToJpeg(heic: Buffer): Promise<Buffer> {
    const jpeg = await convert({
        buffer: heic,
        format: 'JPEG',
        quality: 1
    })
    return Buffer.from(jpeg)
}
async function saveJpegPhoto(jpeg: Buffer, id: string) {
    
    await fs.writeFile(`public/source/${id}.jpeg`, jpeg)
}

interface IInitialMeta {
    title?: string
    tags?: string
}

async function saveMetadata(heicMetadata: IExifMeta, initialMetadata: IInitialMeta, id: string) {
    try {
        const title = initialMetadata.title ? initialMetadata.title[0].toUpperCase() + initialMetadata.title.slice(1) : undefined
        const tags = initialMetadata.tags ? initialMetadata.tags.toLowerCase().split(' ') : undefined

        if (tags) { 
            for (let index = 0; index < tags.length; index++) {
                if (!tags[index]) {
                    tags.splice(index, 1)
                    index--
                }
            }
        }
    
        const nanoServer = nano(DB_URI)
            
        const photoDB: nano.DocumentScope<IPhoto> = nanoServer.db.use('exhale-photos')
    
        await photoDB.insert({
            _id: id,
            title,
            tags,
            ...heicMetadata
        })
    } catch (error) {
        console.log('Error occured during saving the image metadata. The photo saved without meta info\n', error)

        return {}
    }
}

async function triggerUpdateAction() {
    try {
        const octokit = new Octokit({
            auth: process.env.ACTION_ACCESS_TOKEN!
        })
          
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: '18degrees',
            repo: 'exhale',
            workflow_id: 'update.yml',
            ref: 'main',
        })
    } catch (error) {
        console.log(error)
    }
}
