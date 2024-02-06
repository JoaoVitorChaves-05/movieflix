import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function GET(request, { params }) {

    const { movie_id } = params
    console.log('movie_id: ' + movie_id)

    try {
        const comments = await prismaClient.comment.findMany({
            where: { movie_id: Number.parseInt(movie_id) },
            include: {
                author: true
            }
        })

        console.log(comments)

        return Response.json({ status: true, result: comments })
    } catch (err) {
        console.log("ERROR: " + err)

        return Response.json({ status: false, message: err})
    }
}

export async function POST(request, { params }) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'token not found' })

    const {user_id} = jwt.verify(token, process.env.SECRET_KEY)
    const { movie_id } = params

    if (!user_id)
        return Response.json({ status: false, message: 'credentials not authorizeds'})

    try {

        const { title, content } = await request.json()

        await prismaClient.comment.create({
            data: {
                title,
                content,
                author_id: user_id,
                movie_id: Number.parseInt(movie_id)
            }
        })

        return Response.json({ status: true, message: 'comment created' })

    } catch (err) {

        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err})

    }
    
}

export async function PUT(request, {params}) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'token not found' })

    const user_id = jwt.verify(token, process.env.SECRET_KEY)
    const { movie_id } = params

    if (!user_id)
        return Response.json({ status: false, message: 'credentials not authorizeds'})

    try {
        
        const { comment_id, title, content } = await request.json()

        const thisUserIsAuthorized = await prismaClient.comment.findUnique({
            where: {
                comment_id: comment_id,
                author_id: user_id,
                movie_id: movie_id
            }
        })

        if (!thisUserIsAuthorized)
            return Response.json({ status: false, message: 'user not authorizeds'})

        await prismaClient.comment.update({
            where: {
                comment_id: comment_id,
                author_id: user_id,
                movie_id: movie_id
            },
            data: {
                title,
                content
            }
        })

        return Response.json({ status: false, message: 'comment updated successfully'})

    } catch (err) {

        console.log('ERROR: ' + err)

        return Response.json({ status: false, message: err })

    }
    
}

export async function DELETE(request, { params }) {

    const cookieStore = cookies()
    const token = cookieStore.get('token').value

    if (!token)
        return Response.json({ status: false, message: 'token not found' })

    const user_id = jwt.verify(token, process.env.SECRET_KEY)
    const { movie_id } = params

    if (!user_id)
        return Response.json({ status: false, message: 'credentials not authorizeds'})
    
    try {

        const { comment_id } = await request.json()

        const thisUserIsAuthorized = await prismaClient.comment.findUnique({
            where: {
                comment_id: comment_id,
                author_id: user_id,
                movie_id: movie_id
            }
        })

        if (!thisUserIsAuthorized)
            return Response.json({ status: false, message: 'user not authorizeds'})

        await prismaClient.comment.delete({
            where: {
                comment_id: comment_id,
                author_id: user_id,
                movie_id: movie_id
            },
            data: {
                title,
                content
            }
        })

        return Response.json({ status: false, message: 'comment deleted successfully'})

    } catch (err) {

        console.log('ERROR: ' + err)

        return Response.json({ status: false, message: err })

    }
}

