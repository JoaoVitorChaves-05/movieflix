import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function PUT(request) {
    const cookieStore = cookies()

    try {
        const { title, content, comment_id } = await request.json()

        const token = cookieStore.get('token').value
        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        const findComment = await prismaClient.comment.findUnique({
            where: { comment_id: comment_id, author_id: user_id }
        })

        if (!findComment)
            return Response.json({ status: false, message: 'Comentário não encontrado' })

        await prismaClient.comment.update({
            where: {
                comment_id
            },
            data: {
                content,
                title
            }
        })

        return Response.json({ status: true, message: 'Comentário editado com sucesso'})
    } catch (err) {
        console.log('ERROR: ' + err)

        return Response.json({ status: false, message: err})
    }
}

export async function DELETE(request) {
    const cookieStore = cookies()

    try {
        const token = cookieStore.get('token').value
        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        const findComment = await prismaClient.comment.findUnique({
            where: { comment_id: comment_id, author_id: user_id }
        })

        if (!findComment)
            return Response.json({ status: false, message: 'Comentário não encontrado' })

        await prismaClient.comment.delete({
            where: {
                comment_id
            }
        })

        return Response.json({ status: true, message: 'Comentário delatado com sucesso'})
    } catch (err) {
        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err})
    }
}