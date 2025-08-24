import React, { useEffect, useState } from "react";
import api from "../axios";
import { useContentStore } from "../store/content";
import MovieCard from "../components/MovieCard";
import { h1 } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const contentStore = useContentStore();
  const navigate = useNavigate()
  const { movie, tv } = contentStore;

  useEffect(() => {
    if(movie.data.length == 0){

      contentStore.fetchContent("movie");
    }
    if(tv.data.length == 0) {

      contentStore.fetchContent("tv");
    }
  }, []);


  return (
  
   <>
   <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md">Movies</h1>
    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-4 gap-5 scrollbar-hide pe-4 ">
      {movie.data.slice(0,10).map((e,index) => (
     
          <MovieCard
          key={index}
            date={e.release_date}
            id={e.id}
            poster={e.poster_path}
            title={e.title}
            content="movie"
          ></MovieCard>
        
      ))}
      <div onClick={() => navigate('/movie')} className="w-[200px] shrink-0 bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
   <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md">TV</h1>
    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-4 gap-5 scrollbar-hide pe-4 ">
      {tv.data.map((e,index) => (
     
          <MovieCard
          key={index}
            date={e.first_air_date}
            id={e.id}
            poster={e.poster_path}
            title={e.name}
            content="tv"
          ></MovieCard>
        
      ))}
      <div onClick={() => navigate('/serie')} className="w-[200px] shrink-0 bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
  
   
   </>
  );
};

export default Index;
