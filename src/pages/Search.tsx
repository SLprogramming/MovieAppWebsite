import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  useContentStore,
  type MovieContentType,
  type TVContentType,
} from "../store/content";
import MovieCard from "../components/MovieCard";
const SearchPage = () => {
  // const { movie } = useAuthStore();
  const { searchContent,searchedContents,searchKeyword} = useContentStore();
  const [contents, setContents] = useState<
    (MovieContentType | TVContentType)[]
  >([]);
  const [keyword, setKeyword] = useState("");
  // const [page,setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    // clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);

    // set new debounce timeout
    const newTimeout = setTimeout(async () => {
      if(value.trim() == ""){
        setContents([])
        return
      }
      try {
        setIsLoading(true);
      await searchContent({ keyword: value, page: 1 });
       
        console.log("query run:", value);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }, 800);

    setTimeoutId(newTimeout);
  };

  useEffect(() => {
    setKeyword(searchKeyword)
    setContents(searchedContents)
  },[searchedContents])
  

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
          {isLoading ? (
            <div className="w-full  h-[500px] flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-[var(--secondary-bg)] border-t-[var(--text-highlight)] rounded-full animate-spin mb-4"></div>
            </div>
          ) : (<>
                  <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex  flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3 relative">
        {  contents.map((e) => {
            return (
              <div key={e.id}>
                <MovieCard
                  content={"release_date" in e ? "movie" : "tv"}
                  date={
                    "release_date" in e ? e.release_date : e.first_air_date
                  }
                  id={e.id}
                  poster={e.poster_path}
                  title={"title" in e ? e.title : e.name}
                ></MovieCard>
              </div>
            );
          })}
</div>

          </>
          )}
        
      </div>
    </>
  );
};

export default SearchPage;
