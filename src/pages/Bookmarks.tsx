import { useEffect, useState } from "react";
import { useAuthStore, type SpecialContentsType, type User } from "../store/user";
import { type MovieContentType, type TVContentType } from "../store/content";

import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

type PropType = {
  contentType: "bookmark" | "recent" | "favorite";
};

const Bookmarks = ({ contentType }: PropType) => {
  const {  fetchSpecialContent ,user} = useAuthStore();
  const authStore = useAuthStore()
 


let userContent: SpecialContentsType[] = (user?.[contentType as keyof User] as SpecialContentsType[]) ?? []


  // const { movie, tv } = useContentStore();
  const [contents, setContents] = useState<(MovieContentType | TVContentType)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      
     
     
      if(user){
        console.log(authStore[contentType].length , userContent?.length)
        authStore[contentType].length != userContent?.length  &&
          (await fetchSpecialContent({ key: contentType }));

      }
    })();
  }, []);
  useEffect(() => {
    (() => {
      try {
        // console.log(movie.recent,tv.recent)
        setContents(authStore[contentType]);
      
        // console.log(movie[contentType],tv[contentType])
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authStore[contentType]]);

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
      {contents.length > 0 && (
        <>
          <h1 className="text-[var(--text-highlight)] mt-2  font-bold text-md capitalize">
            {contentType}
          </h1>
          <div className="w-full  flex flex-wrap gap-3  py-4 pt-2 md:pt-4">
            {[...contents].reverse().map((e, index) => {
              return (
                <MovieCard
                  key={`${e.id}-${index}`}
                  content={"release_date" in e ? 'movie' : 'tv'}
                  date={'release_date' in e ? e.release_date : e.first_air_date}
                  id={e?.id}
                  poster={e?.poster_path}
                  title={'title' in e? e.title : e.name}
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
