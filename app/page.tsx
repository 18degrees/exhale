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
const REQ_PER_MS = 2000
const TRIGGER_REQ_HEIGHT = 100

export default function Home() {
	const [metadata, setMetadata] = useState<IMetadata[]>([])

	const reqSentTime = useRef(0)

	const page = useRef(0)

	useEffect(() => {
		getPhotos()

		window.addEventListener('scroll', () => {
			const scrolledPart = document.documentElement.scrollTop
			const displayHeight = document.documentElement.clientHeight
			const heightTotal = document.documentElement.scrollHeight

			if (heightTotal - (scrolledPart + displayHeight) <= TRIGGER_REQ_HEIGHT) getPhotos()
		})
		
		async function getPhotos() {
			try {
				if (Date.now() - reqSentTime.current < REQ_PER_MS) return;

				reqSentTime.current = Date.now()

				const res = await fetch('api/gallery', {
					headers: {
						page: page.current.toString()
					}
				})
				if (!res.ok) throw res
	
				if (res.status === 204) return;
	
				page.current = page.current + 1
	
				const body = await res.json() as IResBody
	
				body.metadata.map((meta, index) => {
					setMetadata(prev => {
						return [...prev, meta]
					})
				})
				
			} catch (error) {
				console.log(error)
			}
		}
	}, [])

	return (
		<div className={style.container}>
			<Masonry
				items={metadata}
				config={{
					columns: [1, 2, 3],
					gap: [24, 24, 24],
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
