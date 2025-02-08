import { IPhoto } from "@/app/interfaces/photo.interface"
import type { Metadata } from "next"

interface PhotoParams {
    params: { 
        id: string 
    }
}

const URL = process.env.URL!
 
export async function generateMetadata({ params }: PhotoParams): Promise<Metadata> {
    const res = await fetch(`${URL}/api/photo`, {
        headers: {
            id: params.id
        }
    })

    if (!res.ok || res.status === 204) return {}

    const metadata: IPhoto = await res.json()

    const description = (
        (metadata.createDateMask && metadata.tags && metadata.tags[0]) ? 
            `Изображение с разрешением ${metadata.width}x${metadata.height}, сделанное ${metadata.createDateMask}, описывается следующими тегами: ${metadata.tags.join(', ')}`
        : (metadata.tags && metadata.tags[0]) ? 
            `Изображение с разрешением ${metadata.width}x${metadata.height} описывается следующими тегами: ${metadata.tags.join(', ')}` 
        : (metadata.createDateMask) ? 
            `Смотреть и скачать бесплатно изображение с разрешением ${metadata.width}x${metadata.height}, сделанное ${metadata.createDateMask}` 
        : `Смотреть и скачать бесплатно изображение с разрешением ${metadata.width}x${metadata.height} в оригинальном качестве`
    )
 
    return {
        title: `${metadata.title} — Фотография`,
        description
    }
}

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return <>{children}</>
}