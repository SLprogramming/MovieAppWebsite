import { useEffect, useMemo, useState } from "react";
import { useAuthStore, type SpecialContentsType, type User } from "../store/user";
import { type MovieContentType, type TVContentType } from "../store/content";

import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

type PropType = {
  contentType: "bookmark" | "recent" | "favorite";
};

const Bookmarks = ({ contentType }: PropType) => {
  const { fetchSpecialContent, user } = useAuthStore();
  const authStore = useAuthStore();

  const userContent: SpecialContentsType[] =
    (user?.[contentType as keyof User] as SpecialContentsType[]) ?? [];

 

  // 🔹 Fetch missing data when needed
  useEffect(() => {
    if (!user) return;

    (async () => {
      if (authStore[contentType].length !== userContent.length) {
     
        try {
          await fetchSpecialContent({ key: contentType });
        } finally {
      
        }
      }
    })();
  }, [user, contentType, authStore, userContent.length, fetchSpecialContent]);

  // 🔹 Derived contents (no extra state needed)
  const contents = useMemo<(MovieContentType | TVContentType)[]>(() => {
    return authStore[contentType] ?? [];
  }, [authStore, contentType]);



  if (contents.length === 0) {
    return (<div className="w-full h-full flex items-center justify-center"><div className="text-center -translate-y-[200px] text-2xl">No Content Found!</div></div>); // or a "No content found" message
  }

  return (
    <>
      <h1 className="text-[var(--text-highlight)] mt-2 font-bold text-md capitalize">
        {contentType}
      </h1>
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3">
        {[...contents].reverse().map((e, index) => (
          <MovieCard
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
