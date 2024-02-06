import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function GET(request, { params }) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'authentication is required' })

    const {user_id} = jwt.verify(token, process.env.SECRET_KEY)
    
    const { movie_id } = params

    try {
        
        const favorite = await prismaClient.favorite.findFirst({
            where: {
                movie_id: Number.parseInt(movie_id),
                author_id: Number.parseInt(user_id)
            }
        })

        if (!favorite)
            return Response.json({ status: true, result: { favorite: false }})

        return Response.json({ status: true, result: { favorite: true }})

    } catch (err) {
        console.log("ERROR: " + err)

        return Response.json({ status: false, message: err})

    }

}

export async function POST(request, { params }) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'authentication is required' })

    const {user_id} = jwt.verify(token, process.env.SECRET_KEY)
    const { movie_id } = params

    if (!user_id)
        return Response.json({ status: false, message: 'credential not authorized' })

    try {

        const isFavorited = await prismaClient.favorite.findFirst({
            where: {
                movie_id: Number.parseInt(movie_id),
                author_id: user_id
            }
        })

        if (isFavorited)
            return Response.json({ status: false, message: 'The movie already favorited'})

        await prismaClient.favorite.create({
            data: {
                movie_id: Number.parseInt(movie_id),
                author_id: user_id
            }
        })

        return Response.json({ status: true, result: { favorite: true}})
    } catch (err) {

        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err })

    }

}

export async function DELETE(request, { params }) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'authentication is required' })

    const {user_id} = jwt.verify(token, process.env.SECRET_KEY)
    
    const { movie_id } = params

    if (!user_id)
        return Response.json({ status: false, message: 'credential not authorized' })

    try {

        const isFavorited = await prismaClient.favorite.findFirst({
            where: {
                movie_id: Number.parseInt(movie_id),
                author_id: user_id
            }
        })

        console.log(isFavorited)

        if (!isFavorited)
            return Response.json({ status: false, message: 'The movie already is not favorited'})

        await prismaClient.favorite.delete({
            where: {
                favorite_id: isFavorited.favorite_id
            }
        })

        return Response.json({ status: true, result: { favorite: false } })

    } catch (err) {

        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err })

    }

}