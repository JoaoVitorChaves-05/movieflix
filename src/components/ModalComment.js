'use client'
import { useState } from "react"

import '@/styles/modal.css'
import '@/styles/form.css'

export default function ModalComment({isVisible, setIsVisible, movie_id, fetchComments, fetchAll}) {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const tryCreateComment = async (e) => {
        e.preventDefault()

        try {
            const result = await fetch(`/api/comments/${movie_id}`, {method: 'POST', body: JSON.stringify({title: title, content: content}), headers: {'Content-Type': 'application/json'}})
            const data = await result.json()

            if (!data.status)
                console.log(data.message)

        } catch (e) {
            console.log(e)
        }

        setIsVisible(!isVisible)
        fetchAll()
    }

    if (isVisible) {
        return (
            <div className="overlay">
                <form className="modal form rounded-md" onSubmit={tryCreateComment}>
                    <h1 className="text-center md:text-4xl text-2xl mb-5 pt-4 pl-4 pr-4">Escreva um comentário</h1>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <label>Título</label>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" name="title" className="rounded-md input px-4 sm:text-lg text-md" />
                    </div>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <label>Conteúdo</label>
                        <textarea draggable={false} onChange={(e) => setContent(e.target.value)} name="content" className="content rounded-md input px-4 sm:text-lg text-md" />
                    </div>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg gap-2">
                        <button className="confirm-button rounded-md py-2" onClick={tryCreateComment}>Confimar</button>
                        <button className="confirm-button rounded-md py-2" onClick={() => setIsVisible(!isVisible)}>Cancelar</button>
                    </div>
                </form>
            </div>
        )
    }

}