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
        setIncludedValues((prev) => {
            switch (value) {
                case 'camera':
                    return {...prev, camera: !prev.camera}

                case 'coordinates':
                    return {...prev, coordinates: !prev.coordinates}

                case 'createDate':     
                    return {...prev, createDate: !prev.createDate}
            }

        })
    }
    return (
        <form className={style.form} onSubmit={submit}>
            <label>
                Название
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
                Тэги
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
                Фото
                <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg"
                    required={true}
                    onChange={e => setFiles(e.currentTarget.files)}
                />
            </label>
            <div>
                <label>Дата создания <input type='checkbox' name='create-date' id='create-date' checked={includedValues.createDate} onChange={() => onChangeIncludedValue('createDate')}/></label>
                <label>Модель камеры <input type='checkbox' name='camera' id='camera' checked={includedValues.camera} onChange={() => onChangeIncludedValue('camera')}/></label>
                <label>Координаты <input type='checkbox' name='coordinates' id='coordinates' checked={includedValues.coordinates} onChange={() => onChangeIncludedValue('coordinates')}/></label>
            </div>
            <input 
                type='submit'
                value='Сохранить фото'
            />
        </form>
    )
}