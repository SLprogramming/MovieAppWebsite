import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAuthStore } from "../store/user";
import type { MovieContentType } from "../store/content";
import MovieCard from "../components/MovieCard";
const SearchPage = () => {
  const { movie, tv } = useAuthStore();
  const [contents, setContents] = useState<MovieContentType[]>([]);
  const [keyword,setKeyword] = useState('')
 const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    // clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);

    // set new debounce timeout
    const newTimeout = setTimeout(() => {
      console.log("query run:", value);
    }, 800);

    setTimeoutId(newTimeout);
  };
  useEffect(() => {
    setContents(movie.recent);
  }, []);
  return (
    <>
      <div className="w-full p-4">
        {/* Search Input */}
        <div className="relative w-full max-w-md mx-auto mb-5">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={handleOnchange}
            className="w-full bg-[var(--secondary-bg)] border border-gray-300 rounded-2xl pl-10 pr-4 py-2 text-[var(--text-highlight)]
                     placeholder-[var(--text-highlight)] focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
          />
        </div>

        {/* Results Container */}
        <div className="w-full flex flex-wrap gap-4 scrollbar-hide pt-4">
          {[...contents].reverse().map((e, index) => {
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
        </div>
      </div>
    </>
  );
};

export default SearchPage;
