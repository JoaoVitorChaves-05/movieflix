import { useEffect, useState } from "react"
import Cookies from "js-cookie"

const Header = ({activeLink, movieScreen}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [needFetch, setNeedFetch] = useState(true)

    useEffect(() => {
        const hasToken = Cookies.get('token')

        const fetchIsLoggedIn = async () => {
            if (hasToken && needFetch) {
                const result = await fetch('/api/auth/token')
                const data = await result.json()

                console.log(data)
                setNeedFetch(false)
                setIsLoggedIn(data.status)
            }
        }

        fetchIsLoggedIn()

    }, [isLoggedIn])

    
    if (movieScreen)
        return (
            <header className='flex md:flex-row flex-col py-4 xl:px-40 px-20 items-center justify-between'>
                <h1 className='text-4xl primary-text-color'>Movieflix</h1>
                <ul className='flex flex-row menu gap-4'>
                    <li className={`text-xl ${activeLink == 'Movies' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/">Movies</a></li>
                    {isLoggedIn ? <li className={`text-xl ${activeLink == 'Profile' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/profile">Profile</a></li> : null}
                </ul>
                <a href='https://www.linkedin.com/in/joao-vitor-mancio-chaves/' target='_blank' className='text-xl active-text-color'>LinkedIn</a>
            </header>
        )
    
    if (isLoggedIn)
        return (
            <header className='flex md:flex-row flex-col py-4 xl:px-40 px-20 items-center justify-between'>
                <h1 className='text-4xl primary-text-color'>Movieflix</h1>
                <ul className='flex flex-row menu gap-4'>
                    <li className={`text-xl ${activeLink == 'Movies' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/">Movies</a></li>
                    <li className={`text-xl ${activeLink == 'Profile' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/profile">Profile</a></li>
                </ul>
                <a href='https://www.linkedin.com/in/joao-vitor-mancio-chaves/' target='_blank' className='text-xl active-text-color'>LinkedIn</a>
            </header>
        )

    return (
        <header className='flex md:flex-row flex-col py-4 xl:px-40 px-20 items-center justify-between'>
            <h1 className='text-4xl primary-text-color'>Movieflix</h1>
            <ul className='flex flex-row menu gap-4'>
                <li className={`text-xl ${activeLink == 'Movies' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/">Movies</a></li>
                <li className={`text-xl ${activeLink == 'Login' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/login">Login</a></li>
                <li className={`text-xl ${activeLink == 'Register' ? 'active-text-color' : 'desactive-text-color'}`}><a href="/register">Register</a></li>
            </ul>
            <a href='https://www.linkedin.com/in/joao-vitor-mancio-chaves/' target='_blank' className='text-xl active-text-color'>LinkedIn</a>
        </header>
    )

}

export default Header