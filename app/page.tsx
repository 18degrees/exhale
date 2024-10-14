'use client'

import { useEffect, useRef, useState } from "react"
import Photo from "./components/photo/Photo"
import style from "./page.module.css"

interface IResBody {
	metadata: [{
		id: string
		title?: string
	}]
}
export default function Home() {
	const [photos, setPhotos] = useState<JSX.Element[]>([])
	const page = useRef(0)

	useEffect(() => {
		let ignore = false

		getPhotos()
		
		async function getPhotos() {
			try {
				const res = await fetch('api/gallery', {
					headers: {
						page: page.current.toString()
					}
				})
				if (!res.ok) throw res
	
				if (res.status === 204) return
	
				page.current = page.current + 1
	
				const body = await res.json() as IResBody
	
				if (!ignore) setPhotos(prev => [...prev, ...body.metadata.map(({id, title}, index) => {
					return (
						<Photo 
							id={id}
							key={id}
							width={400} 
							quality={75}
							title={title}
							priority={index <= 2 ? true : false}
						/>
					)
				})])
			} catch (error) {
				console.log(error)
			}
		}
		return () => {
			ignore = true
		}

	}, [])
	return (
		<div className={style.container}>
			{photos.map(photo => photo)}
		</div>
	)
}
