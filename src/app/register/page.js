'use client'
import Header from "@/components/Header"
import '@/styles/form.css'

import { useRouter } from 'next/navigation'

import { useState, useEffect } from "react"
import { MdCancel } from "react-icons/md"


export default function Register() {

    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [logMessage, setLogMessage] = useState(null)

    const tryRegister = async (e) => {
        e.preventDefault()

        const url = '/api/auth/register'

        const result = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({username, email, password})})
        .then(res => res.json())
        .catch(err => console.log(err))

        console.log(result)

        if (!result.status)
            return setLogMessage(result.message)

        router.push('/login')
    }

    return (
        <>
            <Header activeLink={'Register'} />
            <main className="flex flex-col items-center justify-center h-screen py-4 xl:px-40 md:px-20 px-10">
                {logMessage ? (<div className="flex items-center justify-between rounded-md md:w-96 w-full p-2 bg-neutral-100 mb-4">
                    <p className="font-bold text-slate-900">{logMessage}</p>
                    <MdCancel onClick={() => setLogMessage(null)}/>
                </div>) : null}
                <form className="form rounded-md md:w-96 w-full" onSubmit={tryRegister}>
                    <h1 className="text-center md:text-4xl text-2xl mb-5 pt-4">Cadastre-se</h1>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <label>Nome de usuário</label>
                        <input onChange={e => setUsername(e.target.value)} type="text" name="username" className="rounded-md input px-4 sm:text-lg text-md" />
                    </div>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <label>E-mail</label>
                        <input onChange={e => setEmail(e.target.value)} type="email" name="email" className="rounded-md input px-4 sm:text-lg text-md" />
                    </div>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <label>Senha</label>
                        <input onChange={e => setPassword(e.target.value)} type="password" name="password" className="rounded-md input px-4 sm:text-lg text-md" />
                    </div>
                    <div className="flex flex-col p-4 md:text-2xl sm:text-xl text-lg">
                        <button className="confirm-button rounded-md py-2">Confimar</button>
                    </div>
                </form>
            </main>
        </>
    )
}