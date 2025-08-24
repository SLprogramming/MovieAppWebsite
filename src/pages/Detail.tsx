import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import { div } from "framer-motion/client";
import { Bookmark, Calendar, ChevronLeft, Info, Star } from "lucide-react";

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("content") as "movie" | "tv"; // query string
  const contentStore = useContentStore();
  let content = contentStore[`${contentType}Detail`];

  const fetchDetail = async () => {
    contentStore.fetchContentDetail(contentType, id as string);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <div className="relative bg-[var(--primary-bg)] text-[var(--text)] h-screen p-4">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${content.backdrop_path}`}
          alt=""
          className="w-full h-full object-cover blur-sm" // <-- added blur-sm
        />
        {/* Optional dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/80"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 py-5 px-7">
        <div className="flex">
          <div
            className="p-3 bg-[var(--secondary-bg)] rounded-full hover:opacity-85"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </div>
        </div>
        <div className="flex mt-5 gap-3">
          <div className="w-[300px] rounded-2xl overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}
              alt=""
            />
          </div>
          <div className="text-[var(--text-highlight)] p-2">
            <h1 className=" font-bold text-2xl">
              {"name" in content ? content.name : content.title}
            </h1>
            <div className="flex gap-4 my-3 text-[.9rem]">
              <div className="flex  gap-1">
                {" "}
                <Calendar height={20} width={20} className="" />{" "}
                <span>
                  {"release_date" in content
                    ? content.release_date
                    : content.first_air_date}
                </span>
              </div>
              <div className="flex  gap-1">
                {" "}
                <Star
                  height={20}
                  width={20}
                  className="text-[var(--primary)]"
                />{" "}
                <span>{content.vote_average}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {content.genres.map((e) => (
                <div
                  key={e.id}
                  className="bg-[var(--secondary-bg)] py-2 px-5 rounded-full"
                >
                  {e.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
            <div className="w-[200px] bg-[var(--primary-bg)] text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer">
                <Info height={20} width={20} />
                <span>

                Review
                </span>
            </div>
            <div className="w-[200px] bg-[var(--primary-bg)] text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer">
                <Bookmark  height={20} width={20} />
                <span>

                Bookmark
                </span>
            </div>
        </div>
       {contentType =="tv" && ( <div className="flex gap-3 mt-5">

        {"seasons" in content && content.seasons.map(e => {
            return (

            <div key={e.id} className="bg-[var(--primary)] text-black font-semibold py-2 px-5 rounded-full">
              {e.name} 
            </div>
            )
        }) }
          
        </div>)}
      </div>
    </div>
  );
};

export default Detail;
