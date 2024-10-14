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
 
    return {
        title: metadata.title,
    }
}

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return <>{children}</>
}