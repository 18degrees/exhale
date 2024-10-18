'use client'

import { useEffect, useRef, useState } from "react"
import Photo from "./components/photo/Photo"
import { Masonry } from "react-plock"
import style from "./page.module.css"

interface IMetadata {
	id: string
	title?: string

}
interface IResBody {
	metadata: IMetadata[]
}
export default function Home() {
	const [metadata, setMetadata] = useState<IMetadata[]>([])

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
	
				if (!ignore) {
					body.metadata.map((meta, index) => {
						setMetadata(prev => {
							return [...prev, meta]
						})
					})
				}
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
			<Masonry
				items={metadata}
				config={{
					columns: [1, 2, 3],
					gap: [48, 24, 12],
					media: [640, 1024, 1024],
				}}
				render={({id, title}, index) => (
					<Photo 
						id={id}
						key={id}
						quality={75}
						title={title}
						priority={index <= 2 ? true : false}
					/>
				)}
    />
		</div>
	)
}
