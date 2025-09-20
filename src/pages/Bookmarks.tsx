import { useEffect, useMemo, useState,  } from "react";
import { useAuthStore, type SpecialContentsType, type User } from "../store/user";
import { type MovieContentType, type TVContentType } from "../store/content";

import MovieCard from "../components/MovieCard";


type PropType = {
  contentType: "bookmark" | "recent" | "favorite";
};

const Bookmarks = ({ contentType }: PropType) => {
  const { fetchSpecialContent, user } = useAuthStore();
  const authStore = useAuthStore();
  const [isLoading ,setIsLoading]  = useState(false)

  const userContent: SpecialContentsType[] =
    (user?.[contentType as keyof User] as SpecialContentsType[]) ?? [];

 

  // 🔹 Fetch missing data when needed
  useEffect(() => {
    if (!user) return;

    (async () => {
      if (authStore[contentType].length !== userContent.length) {
        console.log(authStore[contentType] , userContent)
        setIsLoading(true)
        try {

          await fetchSpecialContent({ key: contentType });
        }catch{

          setIsLoading(false)
        } finally {
          setIsLoading(false)
        }
      }
    })();
  }, [ contentType,  userContent.length]);

  // 🔹 Derived contents (no extra state needed)
  const contents = useMemo<(MovieContentType | TVContentType)[]>(() => {
    return authStore[contentType] ?? [];
  }, [authStore, contentType]);


if(isLoading){
  return (<div className="w-full h-full flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[var(--secondary-bg)] border-t-[var(--text-highlight)] rounded-full animate-spin mb-4"></div>
  </div>)
}
  if (contents.length === 0) {
    return (<div className="w-full h-full flex items-center justify-center"><div className="text-center -translate-y-[200px] text-2xl">No Content Found!</div></div>); // or a "No content found" message
  }
  

  return (
    <>
      <h1 className="text-[var(--text-highlight)] mt-2 font-bold text-md capitalize px-2">
        {contentType}
      </h1>
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3 px-2">
        {[...contents].reverse().map((e, index) => (
          <MovieCard
            needConfirm={contentType == 'recent'}
            key={`${e.id}-${index}`}
            content={"release_date" in e ? "movie" : "tv"}
            date={"release_date" in e ? e.release_date : e.first_air_date}
            id={e.id}
            poster={e.poster_path}
            title={"title" in e ? e.title : e.name}
          />
        ))}
      </div>
    </>
  );
};

export default Bookmarks;
