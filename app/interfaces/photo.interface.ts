export type orientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface IDBPhoto {
    title?: string
    tags?: string[]

    createDate?: string
    offsetTime?: string

    width: number
    height: number

    camera?: string

    latitude?: number
    longitude?: number

    orientation?: orientation
    //https://www.ameto.de/blog/exif-orientation-primer/
}
export interface IPhoto {
    title?: string
    tags?: string[]

    createDateMask?: string

    width?: number
    height?: number

    camera?: string

    googleMapLink?: string
}