import { IDBPhoto } from "@/app/interfaces/photo.interface";
import { NextRequest } from "next/server";
import nano from "nano";

interface IPhotoMetaSup {
    id: string
    title?: string
}

const PHOTO_COUNT_INDEX = 3
const PHOTOS_PER_LOAD = 2 * 3 * PHOTO_COUNT_INDEX   //to align photo for 2 and 3 rows 

const DB_URI = process.env.COUCHDB_URI!

export async function GET(req: NextRequest) {
    try {
        const currentPage = getCurrentPage(req)
    
        const nanoServer = nano(DB_URI)
        
        const photoDB: nano.DocumentScope<IDBPhoto> = nanoServer.db.use('exhale-photos')
    
        const photoDocs = await photoDB.list({
            descending: true, 
            skip: currentPage * PHOTOS_PER_LOAD,
            limit: PHOTOS_PER_LOAD,
            
        })
        if (!photoDocs.rows[0]) {
            return new Response(null, {status: 204})
        }
        const photoIDs = photoDocs.rows.map(doc => doc.id)

        const metadata: IPhotoMetaSup[] = []

        for (const photoID of photoIDs) {
            try {
                const photoMeta = await photoDB.get(photoID)

                metadata.push({id: photoMeta._id, title: photoMeta.title})
            } catch (error) {
                
            }
        }
        return Response.json({metadata})

    } catch (error) {
        return Response.json({message: 'Server error. Try again later'}, {status: 500})
    }
}
function getCurrentPage(req: NextRequest): number {
    const headers = req.headers

    const roughCurrentPage = headers.get('page')

    const setCurrentPage = !roughCurrentPage ? 0 : typeof +roughCurrentPage === 'number' ? +roughCurrentPage : 0

    return setCurrentPage
}
