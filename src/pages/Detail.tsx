import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import { div } from "framer-motion/client";
import { Bookmark, Calendar, ChevronLeft, Info, Play, Star } from "lucide-react";
import SkeletonDetail from "../components/SkeletonDetail";
import MovieCard from "../components/MovieCard";
import defaultPoster from "../assets/default_img.png";

const Detail = () => {
  const navigate = useNavigate();
  const contentStore = useContentStore();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("content") as "movie" | "tv"; // query string
  let content = contentStore[`${contentType}Detail`];
  const [imgSrc, setImgSrc] = useState(
    content.poster_path
      ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
      : defaultPoster
  );
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  let similarContents = contentStore[contentType].similar;

  const fetchDetail = async () => {
    contentStore.fetchContentDetail(contentType, id as string);
  };

  useEffect(() => {
    setImgSrc(
      content.poster_path
        ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
        : defaultPoster
    );
    setIsPosterLoaded(false); // reset when new content comes in
  }, [content.poster_path]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (contentStore.isLoading) {
    return <SkeletonDetail />;
  }

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
            onClick={() => navigate(`/${contentType == 'movie' ? 'movie' : 'serie'}`)}
          >
            <ChevronLeft />
          </div>
        </div>
        <div className="flex mt-5 gap-3">
          <div className="w-[300px] rounded-2xl overflow-hidden">
            <img
              src={imgSrc}
              alt="poster"
              className={`transition-opacity duration-500 ${
                isPosterLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsPosterLoaded(true)}
              onError={(e) => {
                if (imgSrc !== defaultPoster) {
                  setImgSrc(defaultPoster); // only swap once
                }
              }}
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
              {content?.genres?.length > 0 &&
                content?.genres?.map((e) => (
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
            <Play  height={20} width={20} />
            <span>Watch</span>
          </div>
          <div className="w-[200px] bg-[var(--primary-bg)] text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer">
            <Info height={20} width={20} />
            <span>Review</span>
          </div>
          <div className="w-[200px] bg-[var(--primary-bg)] text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer">
            <Bookmark height={20} width={20} />
            <span>Bookmark</span>
          </div>
        </div>
        {contentType == "tv" && (
          <div className="flex gap-3 mt-5 overflow-x-scroll scrollbar-hide">
            {"seasons" in content &&
              content.seasons.map((e) => {
                return (
                  <div
                    key={e.id}
                    className="bg-[var(--primary)] shrink-0 text-black font-semibold py-2 px-5 rounded-full"
                  >
                    {e.name}
                  </div>
                );
              })}
          </div>
        )}
        <div className="mt-5">
          <h1 className="text-[var(--text-highlight)] font-bold text-2xl mb-3">
            You May Like
          </h1>
          <div className="flex flex-nowrap overflow-x-scroll scrollbar-hide w-full gap-5 p-4">
            {similarContents?.length > 0 &&
              similarContents?.map((e) => (
                <MovieCard
                  key={e.id}
                  content={contentType}
                  date={
                    "first_air_date" in e ? e.first_air_date : e.release_date
                  }
                  id={e.id}
                  poster={e.poster_path}
                  title={"title" in e ? e.title : e.name}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
