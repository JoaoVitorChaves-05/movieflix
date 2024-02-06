import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function POST(request) {

    try {
        const { username, email, password } = await request.json()

        const findUsername = await prismaClient.user.findUnique({
            where: { username: username }
        })

        const findEmail = await prismaClient.user.findUnique({
            where: { email: email}
        })

        if (findUsername)
            return Response.json({ status: false, message: "Esse nome de usuário já está cadastrado." })

        if (findEmail)
            return Response.json({ status: false, message: "Esse email já está cadastrado." })

        const password_hash = bcryptjs.hashSync(password, 10)

        await prismaClient.user.create({
            data: {
                username,
                email,
                password_hash
            }
        })

        return Response.json({ status: true, message: "Usuário criado com sucesso"})
    } catch (err) {
        console.error('ERROR: ' + err)
        return Response.json({ status: false, message: err })
    }
}

export async function DELETE(request) {
    const cookieStore = cookies()

    try {
        const token = cookieStore.get('token').value
        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        await prismaClient.comment.deleteMany({
            where: {
                author_id: user_id
            }
        })

        await prismaClient.user.delete({
            where: {
                user_id: user_id      
            }
        })

        cookieStore.delete('token')

        return Response.json({ status: true, message: "Usuário deletado com sucesso." })
    } catch (err) {
        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err})
    }


}