import { MetadataRoute } from 'next'
import { IDBPhoto } from './interfaces/photo.interface'
import nano from 'nano'

const DB_URI = process.env.COUCHDB_URI!

const getPhotoPages = async () => {
    try {
        const nanoServer = nano(DB_URI)
                
        const photoDB: nano.DocumentScope<IDBPhoto> = nanoServer.db.use('exhale-photos')
    
        const photoDocs = await photoDB.list({
            descending: true, 
            limit: 10000000,
            
        })
        if (!photoDocs.rows[0]) {
            return []
        }
        const photoUploadTimestamps = photoDocs.rows.map(doc => doc.id)

        return photoUploadTimestamps.map(timestamp => {
            return {
                id: timestamp,
                lastModified: new Date(+timestamp)
            }
        })

    } catch (error) {
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const photoPages = await getPhotoPages()

    const photoRoutes: MetadataRoute.Sitemap = photoPages.map(photoPage => {
        return {
            url: `https://exhale.pics/photo/${photoPage.id}`,
            lastModified: photoPage.lastModified,
            changeFrequency: 'never',
            priority: 0.5
        }
    })

    const lastPhotoUploadDate = photoPages[0] ? photoPages[0].lastModified : new Date()
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: 'https://exhale.pics',
            lastModified: lastPhotoUploadDate,
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ]

    return [
        ...staticRoutes,
        ...photoRoutes
    ]
}