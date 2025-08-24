import React, { useEffect, useRef } from "react";
import {
  useContentStore,
  type MovieContentType,
  type TVContentType,
} from "../store/content";
import MovieCard from "../components/MovieCard";
import { useInfiniteFetch } from "../hooks/InfiniteFetch";
const Movie = ({ content = "movie" }: { content: "movie" | "tv" }) => {
  const firstElementRef = useRef<HTMLDivElement | null>(null);

  const contentStore = useContentStore();
  const { fetchContent } = contentStore;
  const myContents = contentStore[content];

  const lastElementRef = useInfiniteFetch({
    dataLength: myContents.data.length,
    fetchMore: () => fetchContent(content),
  });

  useEffect(() => {
     if(firstElementRef.current){
    firstElementRef.current.scrollIntoView({behavior:"auto"})
   }
  },[content])

  useEffect(() => {
  

    if (myContents.data.length == 0) {
      fetchContent(content);
    }
  }, []);
 
  return (
    <div className="w-full  flex flex-wrap gap-4 scrollbar-hide pt-3" >
      {myContents.data.map((e, index) => {
        const isLast = index === myContents.data.length - 1;
        const isFirst = index === 0

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
