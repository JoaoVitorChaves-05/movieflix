import dotenv from 'dotenv'

export const dynamic = 'force-dynamic'
export async function GET(request, { params }) {

    dotenv.config()

    const { id } = params
    console.log('id server: ' + id)

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY_TOKEN}`,
                'Accept': 'application/json'
            }
        })
        const data = await res.json()
        console.log(data)

        return Response.json(data)
    } catch (err) {
        console.error(err)
        return Response.json(null)
    }
}