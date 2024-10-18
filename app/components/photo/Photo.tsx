'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface PhotoParams {
    id: string
    quality: number
    title?: string
    priority: boolean
}
export default function Photo({id, quality, title, priority}: PhotoParams) {
    const [hasErrorOccurred, setHasErrorOccurred] = useState(false)

    return (
        <Link 
            key={id}
            href={`/photo/${id}`}
            shallow
            style={{textAlign: 'center', width: '95%'}}
            >
            <Image
                src={`/source/${id}.jpeg`}
                onError={() => setHasErrorOccurred(true)}
                alt={title ? title : id}
                title={title}
                quality={quality}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: hasErrorOccurred ? 'none' : 'inline'
                }}
                width={400}
                height={300}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vg8AAlEBZ0IDjCQAAAAASUVORK5CYII="
                priority={priority}
            />
        </Link>
    )
}