import dotenv from 'dotenv'

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request, { params }) {
  dotenv.config()

  const { page } = params

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=pt-BR&page=${page}`)
    const data = await res.json()

    return Response.json(data)
  } catch (err) {
    console.error(err)
    return null
  }

}