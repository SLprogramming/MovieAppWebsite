import  { useEffect, useRef } from "react";
import {
  useContentStore,

} from "../store/content";
import MovieCard from "../components/MovieCard";
import { useInfiniteFetch } from "../hooks/InfiniteFetch";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
const Movie = ({ content = "movie" }: { content: "movie" | "tv" }) => {
  const firstElementRef = useRef<HTMLDivElement | null>(null);

  const contentStore = useContentStore();
  const { fetchContent } = contentStore;
  const myContents = contentStore[content];

  const lastElementRef = useInfiniteFetch({
    dataLength: myContents?.data?.length,
    fetchMore: () => fetchContent(content),
  });

  useEffect(() => {
   
     if(firstElementRef.current){
    firstElementRef.current.scrollIntoView({behavior:"auto"})
   }
      if (myContents?.data?.length == 0) {
      fetchContent(content);
    }
  },[content])


 if(contentStore.isLoading) {
  return(<div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex  flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3 px-2">

     {Array.from({ length: 20 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}

    </div>)
  

 }
  return (
    <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex  flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3 px-2" >
     
      {myContents?.data?.map((e, index) => {
        const isLast = index === myContents.data.length - 1;
        const isFirst = index === 0

         const isEmpty = Object.keys(e).length === 0;
         if(isEmpty) {
          return <MovieCardSkeleton key={index}/>
         }
        return (
          <div
            key={index}
            ref={isLast ? lastElementRef : isFirst?firstElementRef : null}
          >
            <MovieCard
              date={"release_date" in e ? e.release_date : e.first_air_date}
              id={e.id}
              poster={e.poster_path}
              title={"title" in e ? e.title : e.name}
              content={content}
            ></MovieCard>
          </div>
        );
      })}
    </div>
  );
};

export default Movie;
