"use client"

import '@/styles/globals.css'
import '@/styles/movie.css'
import '@/styles/comment.css'

import Header from '@/components/Header'
import ModalComment from '@/components/ModalComment'

import { MdOutlineFavorite } from "react-icons/md";
import { BiCommentAdd } from "react-icons/bi";
import { useEffect, useState } from 'react';

export default function Movies({params}) {

    const { id } = params
    const [data, setData] = useState(null)
    const [comments, setComments] = useState(null)
    const [favorite, setFavorite] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    const fetchData = async (id) => {
            
        try {
            const res = await fetch(`/api/movie/${id}`)
            const dt = await res.json()
            
            return dt
        } catch (err) {
            console.error(err)
        }
    }

    const fetchComments = async (id) => {
        try {
            const res = await fetch(`/api/comments/${id}`)
            const cmt = await res.json()

            if (!cmt.status)
                return null

            return cmt.result
            console.log("Comments: ", cmt)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchFavorite = async (id) => {
        try {
            const res = await fetch(`/api/favorite/${id}`)
            const fav = await res.json()

            if (!fav.status)
                return false

            return fav.result.favorite
        } catch (err) {
            console.log(err)
        }
    }

    const changeFavorite = async (id) => {
        if (favorite) {
            try {
                const res = await fetch(`/api/favorite/${id}`, { method: 'DELETE'})
                const fav = await res.json()

                if (!fav.status)
                    return setFavorite(favorite)

                return setFavorite(!favorite)
            } catch (err) {
                return console.log(err)
            }
        }

        try {
            const res = await fetch(`/api/favorite/${id}`, { method: 'POST'})
            const fav = await res.json()

            if (!fav.status)
                return setFavorite(favorite)

            return setFavorite(!favorite)
        } catch (err) {
            return console.log(err)
        }
    }

    const fetchAll = async () => {
        try {
            const [movieData, commentsData, favoriteData] = await Promise.all([
                fetchData(id),
                fetchComments(id),
                fetchFavorite(id),
            ])

            setData(movieData)
            setComments(commentsData)
            setFavorite(favoriteData)
        
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {

        /*
        if (!data) fetchData(id)
        if (!comments) fetchComments(id)
        */

        if (!data) {
            fetchAll()
        }

    }, [data])


    return (
        <>
            <Header movieScreen={true}/>
            {data ? (
                <main className='flex flex-col py-4 xl:px-40 md:px-20 px-10'>
                    <section className='flex flex-col lg:flex-row items-center gap-4'>
                        <figure className='w-3/4 sm:w-1/2 lg:basis-1/3'>
                            <img src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}/>
                        </figure>
                        <div className='lg:basis-2/3'>
                            <h2 className='text-center md:text-4xl text-2xl font-extrabold mb-5'>{data.title}</h2>
                            <p className='text-justify text-xl mb-5'>{data.overview}</p>
                            <ul className='mb-5'>
                                <li>Release date: {data.release_date.replace('-', '/').replace('-', '/')}</li>
                                <li>Genres: {data.genres.map(genre => genre.name).join(', ')}</li>
                                <li>Vote average: {data.vote_average.toFixed(1)}/10</li>
                            </ul>
                            <div className='flex flex-col gap-4'>
                                <button className='btn favorite-button py-2 gap-2' onClick={() => changeFavorite(id)}><MdOutlineFavorite />{favorite ? 'Favoritado' : 'Favoritar'}</button>
                                <button className='btn comment-button py-2 gap-2' onClick={() => setIsVisible(!isVisible)}><BiCommentAdd />Comentar</button>
                            </div>
                        </div>
                    </section>
                </main>
            ) : <p>Loading...</p>}
            <div className='flex flex-col py-4 xl:px-40 md:px-20 px-10'>
                <h2 className='text-center md:text-4xl text-2xl font-extrabold mb-5'>Comentários</h2>
                <section className='flex flex-col items-center gap-4'>
                    {comments ? comments.map((comment) => (<div className='flex flex-col comment md:w-3/4 w-100'>
                        <h3 className='md:text-2xl text-xl mb-5'>{comment.title}</h3>
                        <p className='mb-5'>{comment.content}</p>
                        <p>Escrito por: <b>{comment.author.username}</b></p>
                    </div>)) : <h3 className='md:text-2xl text-xl mb-5 text-center'>Nenhum comentário</h3>}
                </section>
            </div>
            <ModalComment isVisible={isVisible} setIsVisible={setIsVisible} movie_id={id} fetchComments={fetchComments} fetchAll={fetchAll} />
        </>
    )
}