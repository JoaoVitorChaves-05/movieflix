import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function GET(request) {
    const cookieStore = cookies()

    try {
        const token = cookieStore.get('token').value

        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        const user = await prismaClient.user.findUnique({
            where: {
                user_id
            },
            select: {
                username: true,
                email: true,
                user_id: true
            }
        })

        return Response.json({ status: true, result: user })
    } catch (err) {
        console.log(err)
        return Response.json({ status: false, message: err})
    }
}

export async function POST(request) {
    const cookieStore = cookies()

    try {
        const { email, password } = await request.json()

        const user = await prismaClient.user.findUnique({
            where: {
                email: email
            },
            select: {
                user_id: true,
                email: true,
                password_hash: true
            }
        })

        if (!user)
            return Response.json({ status: false, message: 'Email e/ou senha incorreto(s)'})

        const match = bcryptjs.compareSync(password, user.password_hash)

        if (!match)
            return Response.json({ status: false, message: 'Email e/ou senha incorreto(s)'})

        const token = jwt.sign({ user_id: user.user_id}, process.env.SECRET_KEY, { expiresIn: '60d'})
        cookieStore.set('token', token)

        return Response.json({ status: true, message: 'Autenticado com sucesso'})
    } catch (err) {
        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err })
    }
     
}

export async function PUT(request) {
    const cookieStore = cookies()

    try {
        const { username, email, newPassword } = await request.json()

        const token = cookieStore.get('token').value

        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        const user = await prismaClient.user.findUnique({
            where: {
                user_id
            },
            select: {
                username: true,
                email: true,
                user_id: true
            }
        })

        if (user) {
            if (username && username != '')
                await prismaClient.user.update({
                    where: {
                        user_id
                    },
                    data: {
                        username: username
                    }
                })
            if (email && email != '')
                await prismaClient.user.update({
                    where: {
                        user_id
                    },
                    data: {
                        email: email
                    }
                })
            if (newPassword && newPassword != '')
                await prismaClient.user.update({
                    where: {
                        user_id
                    },
                    data: {
                        password_hash: bcryptjs.hashSync(newPassword, 10)
                    }
                })
            
            return Response.json({ status: true, message: 'Dados atualizados.' })
        }

        return Response.json({ status: false, message: 'Token não autorizado.' })
    } catch (err) {
        console.log('ERROR: ' + err)
        return Response.json({ status: false, message: err })
    }
}

export async function DELETE() {
    const cookieStore = cookies()
    cookieStore.delete('token')

    return Response.json({ status: true, message: 'Usuário deslogado' })
}