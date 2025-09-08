import  { useEffect } from 'react'

import { useContentStore } from '../store/content'
import {useNavigate} from "react-router-dom"

const Genres = () => {
    const {fetchGenres,movie , tv} = useContentStore()
    const navigate = useNavigate()
    useEffect(() => {
        fetchGenres()
    },[])


  return (
    <div className='text-[var(--text-highlight)] mt-2  text-md p-5 '>
        <h1 className='text-center mb-4'>Movie</h1>
        <div className='flex gap-3 w-full flex-wrap'>
            {movie.genre.map((e) => {
                return (<div key={e.id} className='bg-[var(--secondary-bg)] px-5 py-1 rounded-full select-none cursor-pointer text-center hover:opacity-90 ' onClick={() => navigate('/content?id=1')}>{e.name}</div>)
            })}
        </div>
        <h1 className='text-center mb-4 mt-[60px]'>Series</h1>
        <div className='flex gap-3 w-full flex-wrap'>
            {tv.genre.map((e) => {
                return (<div key={e.id} className='bg-[var(--secondary-bg)] px-5 py-1 rounded-full select-none cursor-pointer text-center hover:opacity-90 '>{e.name}</div>)
            })}
        </div>
    </div>
  )
}

export default Genres