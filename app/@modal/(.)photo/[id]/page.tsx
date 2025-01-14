'use client';

import { type ElementRef, useEffect, useRef, useState } from 'react'
import { IPhoto } from "@/app/interfaces/photo.interface"
import { CloseBtn } from './components/Close'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import style from './page.module.css'
import Image from "next/image"
import Link from 'next/link'

export default function Modal({params}: {params: {id: string}}) {
	const [meta, setMeta] = useState<IPhoto>({})

    const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined)

    const aspectRatio = meta.width && meta.height ? meta.width / meta.height : undefined

    useEffect(() => {
        setWindowWidth(document.documentElement.clientWidth)

        getMetadata()

        setSizeEvent()

        async function getMetadata() {
            try {
                const res = await fetch('/api/photo', {
                    headers: {
                        id: params.id
                    }
                })
                
                if (!res.ok || res.status === 204) return
                
                const metadata: IPhoto = await res.json()
        
                setMeta(metadata)
                
            } catch (error) {
                return
            }
        }

        function setSizeEvent() {
            window.addEventListener('resize', function() {
                setWindowWidth(document.documentElement.clientWidth)
            })
        }
    }, [params.id])

	const router = useRouter()
	const dialogRef = useRef<ElementRef<'dialog'>>(null)

	useEffect(() => {
		if (!dialogRef.current?.open) {
			dialogRef.current?.showModal()
		}
	}, []);

	function onDismiss() {
		router.back()
	}

	return createPortal(
		<div className={style.backdrop}>
			<dialog ref={dialogRef} onClose={onDismiss}>
				<button onClick={onDismiss} className={style.close}><CloseBtn/></button>
				<div
                    style={{
                        minWidth: !aspectRatio || !windowWidth ? '100%' : windowWidth > 800 * aspectRatio ? 800 * aspectRatio : '100%'
                    }}>
                    <div className={style['image-wrapper']}>
                        <Image
                            src={`/source/${params.id}.jpeg`}
                            alt={meta.title ? meta.title : params.id}
                            title={meta.title}
                            quality={85}
                            width={aspectRatio ? 800 * aspectRatio : 500}
                            height={800}
                            style={{
                                height: !aspectRatio || !windowWidth ? '800px' : windowWidth > 800 * aspectRatio ? '800px' : 'auto',
                                width: !aspectRatio || !windowWidth ? 'auto' : windowWidth > 800 * aspectRatio ? 'auto' : '100%'
                            }}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vg8AAlEBZ0IDjCQAAAAASUVORK5CYII="
                            priority
                        />
                    </div>
                    <div className={style.metadata}>
                        {meta.title ? <h1>{meta.title}</h1> : null}
                        {meta.tags ? <p className={style.tags}>{meta.tags.map(tag => <span key={tag}>{tag}</span>)}</p> : null}     
                        {meta.createDateMask ? <p>Фото сделано {meta.createDateMask}</p> : null}
                        {meta.googleMapLink ? <p>Смотреть локацию в <Link href={meta.googleMapLink} target="_blank">гугл картах</Link></p> : null}      
                        <p>
                            <Link 
                            href={`/source/${params.id}.jpeg`} 
                            download
                            target="_blank"
                            >Скачать
                            </Link> в оригинальном качестве
                        </p>
                        {/* {meta.camera ? <p className={style.camera}>Камера {meta.camera}</p> : null} */}
                    </div>
				</div>
			</dialog>
			<style jsx global>{`
				html, body {
					overflow: ${dialogRef.current ? 'hidden' : 'auto'}
				}
			`}</style>
		</div>,
		document.getElementById('modal-root')!
	);
}