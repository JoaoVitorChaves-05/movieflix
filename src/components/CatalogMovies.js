
const CatalogPage = ({ movies }) => {

    return (
        <section className='lg:mt-28 md:mt-24 movies'>
            <h2 className='text-center md:text-4xl text-2xl mb-10'>Cátalogo</h2>
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
                {movies.map(movie => (
                    <a key={movie.id} href={`/movies/${movie.id}`}>
                        <figure>
                            <img className='zoom-in' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                            <h3 className='text-center mt-5'>{movie.title}</h3>
                        </figure>
                    </a>
                ))}
            </div>
        </section>
    )

}

export default CatalogPage