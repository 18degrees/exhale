"use client"

import { FormEvent, useState } from 'react'
import style from './page.module.css'

export default function AdminPage() {
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [files, setFiles] = useState<FileList | null>()
    const [includedValues, setIncludedValues] = useState({createDate: true, coordinates: true, camera: true})

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const photo = files![0]

        const reader = new FileReader()

        reader.readAsDataURL(photo)
        
        reader.onload = async () => {
            if (!reader.result) return

            const body = {
                title,
                tags,
                base64URL: reader.result,
                include: includedValues
            }
    
            await fetch('api/photo', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        reader.onerror = () => {
            throw new Error()
        }
    }
    function onChangeIncludedValue(value: 'createDate' | 'coordinates' | 'camera') {
        switch (value) {
            case 'camera':
                setIncludedValues((prev) => {
                    return {...prev, camera: !prev.camera}
                })
                break
            case 'coordinates':
                setIncludedValues((prev) => {
                    return {...prev, coordinates: !prev.coordinates}
                })
            case 'createDate':
                setIncludedValues((prev) => {
                    return {...prev, createDate: !prev.createDate}
                })
        }
    }
    return (
        <form className={style.form} onSubmit={submit}>
            <label>
                Title
                <input
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                />
            </label>
            <label>
                Tags
                <input
                    id="tags"
                    name="tags"
                    type="text"
                    autoComplete="off"
                    onChange={e => setTags(e.target.value)}
                    value={tags}
                />
            </label>
            <label>
                Photo
                <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/heic"
                    required={true}
                    onChange={e => setFiles(e.currentTarget.files)}
                />
            </label>
            <div>
                <label>Create date <input type='checkbox' checked={includedValues.createDate} onChange={() => onChangeIncludedValue('createDate')}/></label>
                <label>Camera model <input type='checkbox' checked={includedValues.camera} onChange={() => onChangeIncludedValue('camera')}/></label>
                <label>Coordinates <input type='checkbox' checked={includedValues.coordinates} onChange={() => onChangeIncludedValue('coordinates')}/></label>
            </div>
            <input 
                type='submit'
                value='Save photo'
            />
        </form>
    )
}