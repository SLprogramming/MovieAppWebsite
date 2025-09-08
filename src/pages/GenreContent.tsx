import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useContentStore,
  type MovieContentType,
  type TVContentType,
} from "../store/content";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import { useInfiniteFetch } from "../hooks/InfiniteFetch";
import MovieCard from "../components/MovieCard";

const GenreContent = () => {
  const [searchParams] = useSearchParams();
  const contentStore = useContentStore();
  const [contents, setContents] = useState<
    (TVContentType | MovieContentType | {})[]
  >([]);
  const id = searchParams.get("id") as string;
  const title = searchParams.get("name");
  const type = searchParams.get("type") as "movie" | "tv";
  const [page, setPage] = useState(1);

  const lastElementRef = useInfiniteFetch({
    dataLength: contents?.length,
    fetchMore: () => fetchContent(),
  });

  const fetchContent = async () => {
    setContents((prev) => [...prev, ...Array.from({ length: 10 }, () => ({}))]);
    try {
      let data = await contentStore.fetchByGenres({ type, id, page });
      if (data.success) {
        setPage((prev) => prev + 1);
        console.log(data.data);
        setContents((prev) => [
          ...prev.filter((e) => Object.keys(e).length !== 0),
          ...data.data,
        ]);
      }
    } catch (error) {
      setContents((prev) => [
        ...prev.filter((e) => Object.keys(e).length !== 0),
      ]);
    } finally {
      setContents((prev) => [
        ...prev.filter((e) => Object.keys(e).length !== 0),
      ]);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);
  return (
    <>
      <h1 className="text-center font-bold text-[var(--text-highlight)]">{title}</h1>
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:flex  flex-wrap overflow-y-scroll gap-4 lg:gap-6 scrollbar-hide pt-3">
        {contents?.map((e, index) => {
          const isLast = index === contents.length - 1;
          // const isFirst = index === 0

          const isEmpty = Object.keys(e).length === 0;
          if (isEmpty) {
            return <MovieCardSkeleton key={index} />;
          }
          return (
            <div key={index} ref={isLast ? lastElementRef : null}>
              <MovieCard
                date={"release_date" in e ? e.release_date : 'first_air_date' in e ? e.first_air_date : ''}
                id={'id' in e ?e.id : 0}
                poster={'poster_path' in e ? e.poster_path : ''}
                title={"title" in e ? e.title : 'name' in e ? e.name : ''}
                content={type}
              ></MovieCard>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GenreContent;
