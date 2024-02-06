import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"

dotenv.config()

const prismaClient = new PrismaClient()

export const dynamic = 'force-dynamic'
export async function GET() {
    const cookieStorage = cookies()

    try {
        const token = cookieStorage.get('token').value
        console.log(token)

        const { user_id } = jwt.verify(token, process.env.SECRET_KEY)

        if (!user_id)
            return Response.json({ status: false, message: 'Token is not valid' })

        const findUser = await prismaClient.user.findUnique({
            where: { user_id: user_id }
        })

        if (!findUser)
            return Response.json({ status: false, message: 'Token is not valid' })

        return Response.json({ status: true, message: 'Token is valid' })
    } catch (err) {
        console.log(err)
        return Response.json({ status: false, message: err })
    }
}