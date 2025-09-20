import  { useEffect } from "react";
// import api from "../axios";
import { useContentStore } from "../store/content";
import MovieCard from "../components/MovieCard";
// import { h1 } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import IndexSkeleton from "../components/IndexSkeleton";


const Index = () => {
  const contentStore = useContentStore();
  const {genreContent} = contentStore
  const navigate = useNavigate()
  const { movie, tv } = contentStore;

  useEffect(() => {
    if(movie.data?.length == 0){

      contentStore.fetchContent("movie");
    }
    if(tv.data.length == 0) {

      contentStore.fetchContent("tv");
    }
 
  }, []);
useEffect(() => {
   console.log(genreContent)
},[genreContent])
  if(contentStore.isLoading){
    return (<IndexSkeleton titles={['Movies','Tv' , '' , '']}/>)
  }
  return (
  
   <>
   <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md px-2">Movies</h1>
    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-2 md:py-4 gap-2 md:gap-5 scrollbar-hide px-4 ">
      {movie.data?.slice(0,10).map((e,index) => (
     
          <MovieCard
          key={index}
            date={e.release_date}
            id={e.id}
            poster={e.poster_path}
            title={e.title}
            content="movie"
          ></MovieCard>
        
      ))}
      <div onClick={() => navigate('/movie')} className="w-[100px]  md:w-[200px]   shrink-0 md:bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden md:shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
   <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md px-2">TV</h1>
    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-2 md:py-4 gap-2 md:gap-5 scrollbar-hide px-4 ">
      {tv?.data?.slice(0,10).map((e,index) => (
     
          <MovieCard
          key={index}
            date={e.first_air_date}
            id={e.id}
            poster={e.poster_path}
            title={e.name}
            content="tv"
          ></MovieCard>
        
      ))}
      <div onClick={() => navigate('/serie')} className="w-[100px]  md:w-[200px] shrink-0 md:bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden md:shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
   {genreContent.movie.length > 0 ? genreContent.movie.map(({title,data,id},index) => {
    return(
      
      <div key={`${index}-${title}`}>

    <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md px-2">{title} Movies</h1>

    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-2 md:py-4 gap-2 md:gap-5 scrollbar-hide px-4 ">
    {data.map((e,i) => {
      return(
   
     
          <MovieCard
          key={`${e.id}-${i}`}
            date={e.release_date}
            id={e.id}
            poster={e.poster_path}
            title={e.title}
            content="movie"
          ></MovieCard>
        
     
    )
  })}
      <div onClick={() => navigate(`/content?id=${id}&type=movie&name=${title}`)} className="w-[100px]  md:w-[200px] shrink-0 md:bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden md:shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
      </div>
      
    )
   }) : (<IndexSkeleton titles={[ '' , '']}/>)}
   {genreContent.tv.length > 0 ? genreContent.tv.map(({title,data,id},index) => {
    return(
      
      <div key={`${index}-${title}`}>

    <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md px-2">{title} Series</h1>

    <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-2 md:py-4 gap-2 md:gap-5 scrollbar-hide px-4 ">
    {data.map((e,i) => {
      return(
   
     
          <MovieCard
              key={`${e.id}-${i}`}
            date={e.first_air_date}
            id={e.id}
            poster={e.poster_path}
            title={e.name}
            content="tv"
          ></MovieCard>
        
     
    )
  })}
      <div  onClick={() => navigate(`/content?id=${id}&type=tv&name=${title}`)} className="w-[100px]  md:w-[200px] shrink-0 md:bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden md:shadow-sm transform transition-transform duration-200 hover:scale-105 shadow-[white] cursor-pointer flex items-center justify-center">
      see more
      </div>
    </div>
      </div>
      
    )
   }) :  (<IndexSkeleton titles={[ '' , '']}/>)}
    
  
   
   </>
  );
};

export default Index;
