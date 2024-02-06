import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function GET() {
    const cookieStore = cookies()

    try {
        const token = cookieStore.get('token').value

        if (!token)
            return Response.json({ status: false, message: 'authentication is required' })

        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        const favoriteMovies = await prismaClient.favorite.findMany({
            where: { author_id: user_id },
            select: { movie_id: true }
        })

        const moviePromises = favoriteMovies.map(async (movie) => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.movie_id}?language=en-US`, {
                headers: { 'Authorization': 'Bearer ' + process.env.API_KEY_TOKEN }
            })
            const data = await response.json()
            return data
        })

        const movies = await Promise.all(moviePromises)

        return Response.json({ status: true, result: movies })
    } catch (err) {
        console.error(err)
        return Response.json({ status: false, message: err.message })
    }
}