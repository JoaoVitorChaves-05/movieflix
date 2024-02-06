'use client'
import Header from '@/components/Header'
import '@/styles/page.css'
import '@/styles/form.css'
import '@/styles/animations.css'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MdCancel } from 'react-icons/md'



export default function Profile() {

    const router = useRouter()

    const [logMessage, setLogMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [movies, setMovies] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!email && !username) {
                const result = await fetch(`/api/auth/login`)
                .then(response => response.json())
                .catch(error => console.error(error))

                if (!result.status)
                    return setLogMessage(result.message)

                setUsername(result.result.username)
                setEmail(result.result.email)
            }
        }

        const fetchMovies = async () => {
            if (!movies) {
                const result = await fetch(`/api/auth/favoriteMovies`)
                .then(response => response.json())
                .catch(err => console.error(err))

                console.log(result)
                setMovies(result.result)
            }
        }

        fetchData()
        fetchMovies()

    }, [username, email, movies])

    const tryUpdate = async (e) => {
        e.preventDefault()

        const result = await fetch(`/api/auth/login`, { method: 'PUT', body: JSON.stringify({ username: username, email: email, newPassword: newPassword })})
        .then(response => response.json())
        .catch(err => console.error(err))

        if (!result.status)
            return setLogMessage(result.message)

        setNewPassword('')
        setLogMessage('Usuário atualizado com sucesso')
    }

    const tryExit = async () => {
        const result = await fetch(`/api/auth/login`, { method: 'DELETE' })
        .then(response => response.json())
        .catch(err => console.error(err))

        if (!result.status)
            return setLogMessage(result.message)

        return router.push('/')
    }

    const tryDelete = async () => {
        const result = await fetch(`/api/auth/register`, { method: 'DELETE' })
        .then(response => response.json())
        .catch(err => console.log(err))

        if (!result.status)
            return setLogMessage(result.message)

        return router.push('/')
    }

    return (
        <>
            <Header activeLink={'Profile'} />
            <main>
                <div className="flex flex-col items-center justify-center h-screen py-4 xl:px-40 md:px-20 px-10">
                    {logMessage ? (<div className="flex items-center justify-between rounded-md md:w-96 w-full p-2 bg-neutral-100 mb-4">
                            <p className="font-bold text-slate-900">{logMessage}</p>
                            <MdCancel onClick={() => setLogMessage(null)}/>
                        </div>) : null}
                    <form className="form rounded-md md:w-96 w-full" onSubmit={tryUpdate}>
                        <h1 className="text-center md:text-4xl text-2xl mb-5 pt-4">Editar perfil</h1>
                        <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                            <label>Nome de usuário</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" className="rounded-md input px-4 sm:text-lg text-md" />
                        </div>
                        <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                            <label>E-mail</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" className="rounded-md input px-4 sm:text-lg text-md" />
                        </div>
                        <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                            <label>Nova senha</label>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" name="password" className="rounded-md input px-4 sm:text-lg text-md" />
                        </div>
                        <div className="flex flex-col p-4 gap-2 md:text-2xl sm:text-xl text-lg">
                            <button type='submit' className="confirm-button rounded-md py-2">Salvar alterações</button>
                            <button onClick={tryExit} className="confirm-button rounded-md py-2">Sair da conta</button>
                            <button onClick={tryDelete} className="confirm-button rounded-md py-2">Excluir conta</button>
                        </div>
                    </form>
                </div>
                <div className='lg:mt-28 md:mt-24 movies xl:px-40 md:px-20 px-10'>
                    <h2 className='text-center md:text-4xl text-2xl mb-10'>
                        Filmes favoritos
                    </h2>
                    {
                        movies ? (
                            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
                                {movies.map(movie => (
                                    <a key={movie.id} href={`/movies/${movie.id}`}>
                                        <figure>
                                            <img className='zoom-in' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                                            <h3 className='text-center mt-5'>{movie.title}</h3>
                                        </figure>
                                    </a>
                                ))}
                            </div>
                        ) : <p className='text-center md:text-2xl text-xl mb-10'>Nenhum filme foi favoritado...</p>
                        }
                </div>
            </main>
        </>
    )
}