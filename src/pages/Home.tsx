import React, { useEffect, useState } from 'react'
import api from '../axios'

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string; // ISO date string
  video: boolean;
  vote_average: number;
  vote_count: number;
}




const Index = () => {
  const [movies,setMovies] = useState<Movie[]>([])

  const fetchMovies = async () => {
  try {
    let res  = await api.get('content/get-all/1')
    console.log(res.data)
    if(res.data.success){
      setMovies(res.data.data)
    }
    return res.data.data
  } catch (error) {
    
  }
}
  useEffect(() => {
    fetchMovies()
   
  },[])
  return (
    <div className='flex flex-wrap gap-5'>
{movies.map((e) => (
  <div
    key={e.id}
    className="group w-[200px] bg-[var(--secondary-bg)] rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200 shadow-[white] cursor-pointer hover:scale-105"
  >
    <div className="overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/w500${e.poster_path}`}
        alt=""
        className="w-full transform transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <h1 className="truncate w-full px-2 pt-2 text-[1.2rem] text-[var(--text-highlight)]">
      {e.original_title}
    </h1>
    <h1 className="px-2 pb-2">{e.release_date.split("-")[0]}</h1>
  </div>
))}


   
    </div>
  )
}

export default Index