import  { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContentStore } from "../store/content";

import {
  Bookmark,
  Calendar,
  ChevronLeft,
  Info,
  Play,
  Star,
} from "lucide-react";
import SkeletonDetail from "../components/SkeletonDetail";
import MovieCard from "../components/MovieCard";
import defaultPoster from "../assets/default_img.png";
import { useAuthStore } from "../store/user";
import { useTrackRoute } from "../hooks/useTrackRoute";

const Detail = () => {
  const navigate = useNavigate();
  const calledRef = useRef<string | null | undefined>(null);
   const lastNonDetailRoute = useTrackRoute();
  const contentStore = useContentStore();
  const { premiumIn, user, contentListToggle } = useAuthStore();
  const [premiumDay, setPremiumDay] = useState(0);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [bookmarkContents, setBookmarkContents] = useState<string[]>([]);
  const [isBookmark, setIsBookmark] = useState(false);
  const [activeButton, setActiveButton] = useState<null | "watch" | "review">(
    null
  );
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


  const handleBack = () => {
  const fallback =
    lastNonDetailRoute ||
    (contentType === "movie" ? "/movie" : "/serie"); // sensible fallback
  navigate(fallback, { replace: true }); // skip stacking another entry
};

  useEffect(() => {
    setImgSrc(
      content.poster_path
        ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
        : defaultPoster
    );
    setIsPosterLoaded(false); // reset when new content comes in
    setActiveButton(null);
  }, [content.poster_path]);

  useEffect(() => {
    (async () => {
      if (calledRef.current === id) return;
  
    calledRef.current = id;
      fetchDetail();
      // console.log()
       contentListToggle({type:'recent',flag:contentType,isAdd:true,id:parseInt(id as string)})
     
    })();
  }, [id]);

  useEffect(() => {
    (() => {
      let myPremiumDay = Math.ceil(premiumIn / (1000 * 60 * 60 * 24));
      setPremiumDay(myPremiumDay);
    })();
  }, [premiumIn]);

  useEffect(() => {
    let data = (content.id || 0).toString();
    if (contentType == "movie") {
      setBookmarkContents(user?.bookmarksMovies as string[]);
    } else {
      setBookmarkContents(user?.bookmarksTV as string[]);
    }
    // console.log(bookmarkContents, data, bookmarkContents.includes(data));
    
    

      setIsBookmark(bookmarkContents.includes(data));
    
  }, [bookmarkContents, content,contentType]);

  if (contentStore.isLoading) {
    return <SkeletonDetail />;
  }

  return (
    <div className="relative bg-[var(--primary-bg)] text-[var(--text)] p-4">
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
            onClick={handleBack }
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
              onError={() => {
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
          <div
            onClick={() =>
              setActiveButton((prev) => (prev == "watch" ? null : "watch"))
            }
            className={`w-[200px]  text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer   ${
              activeButton == "watch"
                ? "text-[var(--text-highlight)] bg-[var(--primary)]/80"
                : "bg-[var(--primary-bg)]"
            }`}
          >
            <Play height={20} width={20} />
            <span>Watch</span>
          </div>
          <div
            onClick={() =>
              setActiveButton((prev) => (prev == "review" ? null : "review"))
            }
            className={`w-[200px]  text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer   ${
              activeButton == "review"
                ? "text-[var(--text-highlight)] bg-[var(--primary)]/80"
                : "bg-[var(--primary-bg)]"
            }`}
          >
            <Info height={20} width={20} />
            <span>Review</span>
          </div>
          <div
            onClick={async () => {
              if (isBookmark) {
                setIsBookmark(false)
     
               let data = await contentListToggle({
                  type: "bookmark",
                  flag: contentType,
                  id: content.id,
                  isAdd: false,
                });
                if(!data.success) {
                  setIsBookmark(true)
                }
              } else {
                                  setIsBookmark(true)
 
               let data = await contentListToggle({
                  type: "bookmark",
                  flag: contentType,
                  id: content.id,
                  isAdd: true,
                });
                if(!data.success){
                  setIsBookmark(false)
                }
              }
            }}
            className={`w-[200px] bg-[var(--primary-bg)] text-center py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer  hover:bg-[var(--secondary-bg)]/90 `}
          >
            <Bookmark
              height={20}
              width={20}
              size={32}
              className={`text-yellow-400 ${
                isBookmark ? "fill-[var(--primary)]" : ""
              }`}
            />
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
        {/* <div  className={`h-full fixed top-0 right-0 w-[600px] bg-[var(--secondary-bg)] p-4 transition-all duration-400 ${activeButton == "review" ? 'translate-x-0':'translate-x-[100%]'}`}>
          <h1 className="text-[var(--text-highlight)] font-bold text-2xl">{'title' in content ? content.title : content.name}</h1>
          <p>{content.tagline}</p>
          <p className="text-[1.1rem] my-4">{content.overview}</p>
          <p> Genres - {content.genres.map(e => e.name + ' ,')}</p>
          <p>Release Date -  {'release_date' in content ? content.release_date : content.first_air_date}</p>
          <p>Original Country -  {content.origin_country}</p>
          <p>Popularity -  {content.popularity}</p>
         
          <a className="my-2 underline text-blue-500" href={content.homepage as string} target="_blank">{content.homepage}</a>
        </div> */}
        <div className="relative h-full w-full">
          {/* Overlay to detect clicks */}
          {activeButton && (
            <div
              className="fixed inset-0 bg-black/20 z-10"
              onClick={() => setActiveButton(null)} // close panel
            ></div>
          )}

          {/* Side panel */}
          <div
            className={`h-full fixed top-0 right-0 w-[600px] bg-[var(--secondary-bg)] p-4 z-20 transition-all duration-400 ${
              activeButton ? "translate-x-0" : "translate-x-[100%]"
            }`}
          >
            {activeButton == "review" ? (
              <div>
                <h1 className="text-[var(--text-highlight)] font-bold text-2xl">
                  {"title" in content ? content.title : content.name}
                </h1>
                <p>{content.tagline}</p>
                <p className="text-[1.1rem] my-4">{content.overview}</p>
                <p>Genres - {content.genres.map((e) => e.name).join(", ")}</p>
                <p>
                  Release Date -{" "}
                  {"release_date" in content
                    ? content.release_date
                    : content.first_air_date}
                </p>
                <p>Original Country - {content.origin_country}</p>
                <p>Popularity - {content.popularity}</p>

                <a
                  className="my-2 underline text-blue-500"
                  href={content.homepage as string}
                  target="_blank"
                >
                  {content.homepage}
                </a>
              </div>
            ) : (
              <>
                {premiumDay > 0 ? (
                  <div className="flex flex-col gap-3 ">
                    <h2 className="text-2xl">watch</h2>
                    <div className="border-1 border-gray-500 p-3 text-center w-2/3 hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                      Stream 1080P
                    </div>
                    <div className="border-1 border-gray-500 p-3 text-center w-2/3 hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                      Stream 720P
                    </div>
                    <div className="border-1 border-gray-500 p-3 text-center w-2/3 hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                      Stream 720P
                    </div>
                    <div className="border-1 border-gray-500 p-3 text-center w-2/3 hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                      Stream 720P
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center text-left scale-130">
                    <h1 className="text-3xl">Get Premium</h1>
                    <div>
                      <h1 className="ps-3">- 4K resolution</h1>
                      <h1 className="ps-3">- Easy To Watch</h1>
                      <h1 className="ps-3">- One Click Download</h1>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
