import  { useEffect, useState } from "react";
import { useAuthStore } from "../store/user";
import {
  
  type MovieContentType,
  type TVContentType,
} from "../store/content";

import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

type PropType = {
  contentType: "bookmark" | "recent" | "favorite";
};

const Bookmarks = ({ contentType }: PropType) => {
  const { user,movie,tv } = useAuthStore();
  // const { movie, tv } = useContentStore();
  const [movies, setMovies] = useState<MovieContentType[]>([]);
  const [series, setSeries] = useState<TVContentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ( () => {
      try {
        // console.log(movie.recent,tv.recent)
        setMovies(movie[contentType]);
        setSeries(tv[contentType]);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movie,tv,user]);

  if (isLoading) {
    return (
      <div className="w-full  flex flex-wrap gap-4 scrollbar-hide pt-3">
        {Array.from({ length: 14 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  
  return (
    <>  
     {movies.length > 0 && (<><h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md capitalize">{contentType} Movies</h1>
      <div className="w-full  flex flex-nowrap overflow-x-scroll gap-4 scrollbar-hide overflow-y-hidden py-4 ">
        {([...movies].reverse()).map((e, index) => {
          return (
            <div key={index}>
              <MovieCard
                content="movie"
                date={e.release_date}
                id={e.id}
                poster={e.poster_path}
                title={e.title}
              ></MovieCard>
            </div>
          );
        })}
      </div></>)}
       {series.length > 0 && (<> <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md capitalize">{contentType} Series</h1>
      <div className="w-full  flex flex-nowrap overflow-x-scroll gap-4 scrollbar-hide overflow-y-hidden py-4">
        {([...series].reverse()).map((e, index) => {
          return (
            <div key={index}>
              <MovieCard
                content="tv"
                date={e.first_air_date}
                id={e.id}
                poster={e.poster_path}
                title={e.name}
              ></MovieCard>
            </div>
          );
        })}
      </div></>)}
    </>
  );
};

export default Bookmarks;
