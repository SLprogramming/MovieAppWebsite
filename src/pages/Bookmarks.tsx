import { useEffect, useState } from "react";
import { useAuthStore, type User } from "../store/user";
import { type MovieContentType, type TVContentType } from "../store/content";

import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

type PropType = {
  contentType: "bookmark" | "recent" | "favorite";
};

const Bookmarks = ({ contentType }: PropType) => {
  const { movie, tv, fetchSpecialContent ,user} = useAuthStore();
   let userKey = {
        movie:{
          recent:'recentMovies',
          bookmark:'bookmarksMovies',
          favorite:'favoritesMovies',
        },
        tv:{
          recent:'recentTV',
          bookmark:'bookmarksTV',
          favorite:'favoritesTV',
        }
      }


let userMovieContent: string[] = (user?.[userKey.movie[contentType] as keyof User] as string[]) ?? []
let userTVContent: string[] = (user?.[userKey.tv[contentType] as keyof User] as string[]) ?? []


  // const { movie, tv } = useContentStore();
  const [movies, setMovies] = useState<MovieContentType[]>([]);
  const [series, setSeries] = useState<TVContentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      
     
     
      if(user){
        
        console.log(movie[contentType].length != userMovieContent?.length)
        movie[contentType].length != userMovieContent?.length  &&
          (await fetchSpecialContent({ type: "movie", key: contentType }));
        tv[contentType].length != userTVContent?.length &&
          (await fetchSpecialContent({ type: "tv", key: contentType }));
      }
    })();
  }, []);
  useEffect(() => {
    (() => {
      try {
        // console.log(movie.recent,tv.recent)
        setMovies(movie[contentType]);
        setSeries(tv[contentType]);
        // console.log(movie[contentType],tv[contentType])
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movie, tv]);

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
      {movies.length > 0 && (
        <>
          <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md capitalize">
            {contentType} Movies
          </h1>
          <div className="w-full  flex flex-nowrap overflow-x-scroll gap-3 scrollbar-hide overflow-y-hidden py-4 pt-2 md:pt-4">
            {[...movies].reverse().map((e, index) => {
              return (
                <MovieCard
                  key={index}
                  content="movie"
                  date={e?.release_date}
                  id={e?.id}
                  poster={e?.poster_path}
                  title={e?.title}
                ></MovieCard>
              );
            })}
          </div>
        </>
      )}
      {series.length > 0 && (
        <>
          {" "}
          <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md capitalize">
            {contentType} Series
          </h1>
          <div className="w-full  flex flex-nowrap overflow-x-scroll gap-3 scrollbar-hide overflow-y-hidden py-4 pt-2 md:pt-4">
            {[...series].reverse().map((e) => {
              return (
                <MovieCard
                  key={e?.id}
                  content="tv"
                  date={e?.first_air_date}
                  id={e?.id}
                  poster={e?.poster_path}
                  title={e?.name}
                ></MovieCard>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Bookmarks;
