"use client"

import '@/styles/page.css'
import '@/styles/sections.css'
import '@/styles/animations.css'

import CatalogMovies from '../components/CatalogMovies.js'
import Header from '../components/Header.js'

import { useEffect, useState } from 'react'

export default function Home() {

  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)

  const getData = async () => {
    try {
      const res = await fetch(`/api/movies/${page}`)
      const dt = await res.json()

      setData(dt)
    } catch (err) {
      console.log(err)
    }

    return null
  }

  const handleNextPage = () => setPage(prev => prev + 1)
  const handleBackPage = () => setPage(prev => (prev > 1 ? prev - 1 : prev))

  useEffect(() => {
    const fetchData = async () => {
      if (!data || page != data.page) {
        await getData()
      }
    }
    fetchData()
  }, [data, page])

  return (
    <>
      <Header activeLink={'Movies'}/>
      <main className='flex flex-col py-4 xl:px-40 md:px-20 px-10'>
        <section className='main-section flex flex-col lg:h-screen lg:justify-center lg:flex-row gap-4 lg:items-center'>
          <div className='box basis-1 lg:basis-1/2'>
            <span className='md:text-2xl text-xl emphasis-text-color'>novidade</span>
            <h2 className='md:text-8xl text-4xl font-extrabold'>Encontre o filme perfeito!</h2>
            <hr />
            <p className='md:text-2xl text-xl'>Explore as dezenas de variações de filmes ao redor do mundo!</p>
            <div className='main-button-area'>
              <button className='main-button md:text-2xl text-xl lg:w-9/10 w-full p-4'>Começar</button>
            </div>
          </div>
          <div className='box basis-1 lg:basis-1/2 box-images'>
            <figure><img src='/figure-1.jpg'></img></figure>
            <figure><img src='/figure-2.jpg'></img></figure>
            <figure><img src='/figure-3.jpg'></img></figure>
            <figure><img src='/figure-4.jpg'></img></figure>
            <figure><img src='/figure-5.jpg'></img></figure>
            <figure><img src='/figure-6.jpg'></img></figure>
            <figure><img src='/figure-7.jpg'></img></figure>
            <figure><img src='/figure-8.jpg'></img></figure>
            <figure><img src='/figure-9.jpg'></img></figure>
            <figure><img src='/figure-10.jpg'></img></figure>
            <figure><img src='/figure-11.jpg'></img></figure>
          </div>
        </section>
        {data ? <CatalogMovies movies={data.results} /> : <p className='text-center md:text-2xl text-xl mb-10'>Carregando os filmes...</p>}
        <div className='flex flex-col items-center'>
          <p>Página atual: {page}</p>
          <div className='flex flex-row gap-1'>
            <button className='rounded-l-lg page-buttons p-2' onClick={handleBackPage}>Voltar</button>
            <button className='rounded-r-lg page-buttons p-2' onClick={handleNextPage}>Próxima</button>
          </div>
        </div>
      </main>
    </>
  )
}