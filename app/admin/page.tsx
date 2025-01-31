"use client"

import { FormEvent, useState } from 'react'
import style from './page.module.css'
import { useRouter } from 'next/navigation'

export default function AdminPage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    const { id } = searchParams

    const router = useRouter()

    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [files, setFiles] = useState<FileList | null>()
    const [includedValues, setIncludedValues] = useState({createDate: true, coordinates: true, camera: true})

    async function submitPUSH(event: FormEvent<HTMLFormElement>) {
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

    async function submitPATCH(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (files) {
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
        
                try {
                    const response = await fetch(`api/photo?id=${id}`, {
                        method: id ? 'PATCH' : 'POST',
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (response.ok) router.replace('/admin')
                } catch (error) {
                    
                }
            }
    
            reader.onerror = () => {
                throw new Error()
            }
        } else {
            const body = {
                title,
                tags,
                include: includedValues
            }
            try {
                const response = await fetch(`api/photo?id=${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) router.replace('/admin')
                
            } catch (error) {
                
            }
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

    async function deletePhoto() {
        try {
            const response = await fetch(`api/photo?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) router.replace('/admin')
        } catch (error) {
            
        }
    }

    return (
        <>
            <form className={style.form} onSubmit={(event) => id ? submitPATCH(event) : submitPUSH(event)}>
                <label>
                    {id ? 'Новое' : null} Название
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
                    {id ? 'Новые' : null} Тэги
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
                    {id ? 'Новое' : null} Фото
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/jpeg"
                        required={!id}
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
                    value={id ? 'Изменить фото' : 'Сохранить фото'}
                />
            </form>
            {id ? (
                <button
                    onClick={deletePhoto}
                    style={{
                        display: 'block',
                        margin: '60px auto 0',
                        backgroundColor: '#e2bebe'
                    }}    
                    >Удалить фото
                </button>
            ) : null}
        </>
    )
}