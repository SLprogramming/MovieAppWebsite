import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContentStore } from "../store/content";

import {
  Bookmark,
  Calendar,
  ChevronLeft,
  Heart,
  Info,
  Play,
  Star,
  ThumbsUp,
} from "lucide-react";
import SkeletonDetail from "../components/SkeletonDetail";
import MovieCard from "../components/MovieCard";
import defaultPoster from "../assets/default_img.png";
import { useAuthStore, type SpecialContentsType } from "../store/user";
import { useTrackRoute } from "../hooks/useTrackRoute";

const Detail = () => {
  const navigate = useNavigate();
  const mobileScrollContentRef = useRef<HTMLDivElement | null>(null);
  const calledRef = useRef<string | null | undefined>(null);
  const lastNonDetailRoute = useTrackRoute();
  const contentStore = useContentStore();
  const { premiumIn, user, contentListToggle } = useAuthStore();
  const [premiumDay, setPremiumDay] = useState(0);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [bookmarkContents, setBookmarkContents] = useState<
    SpecialContentsType[]
  >([]);
  const [isBookmark, setIsBookmark] = useState(false);
  const [favoriteContents, setFavoriteContents] = useState<
    SpecialContentsType[]
  >([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeButton, setActiveButton] = useState<null | "watch" | "review">(
    null
  );
  const contentType = searchParams.get("content") as "movie" | "tv"; // query string

  const [scrollY, setScrollY] = useState(0);
  const [fullMobile, setFullMobile] = useState(0);
  const [mobileCurrentTab, setMobileCurrentTab] = useState<
    "review" | "watch" | "explore"
  >("review");

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
    (async () => {
      if (calledRef.current === id) return;

      calledRef.current = id;
      fetchDetail();
      // console.log()
      await contentListToggle({
        type: "recent",
        flag: contentType,
        isAdd: true,
        id: parseInt(id as string),
      });
      setMobileCurrentTab('review')
    })();
  }, [id]);

useEffect(() => {
  let ticking = false;
  let targetScrollY = window.scrollY;

  const handleScroll = () => {
    targetScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // smooth step toward target scroll
        setScrollY((prev) => prev + (targetScrollY - prev) );

        if (mobileScrollContentRef.current) {
          const rect = mobileScrollContentRef.current.getBoundingClientRect();
          // clamp between 0 and 1
          const opacity = Math.min(
            Math.max((200 - (rect.top - 30)) / 200, 0),
            1
          );
          setFullMobile(opacity);
        }

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleBack = () => {
    const fallback =
      lastNonDetailRoute || (contentType === "movie" ? "/movie" : "/serie"); // sensible fallback
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
    (() => {
      let myPremiumDay = Math.ceil(premiumIn / (1000 * 60 * 60 * 24));
      setPremiumDay(myPremiumDay);
    })();
  }, [premiumIn]);

  useEffect(() => {
    let data = content.id || 0;

    setBookmarkContents((user?.bookmark as SpecialContentsType[]) ?? []);
    setFavoriteContents((user?.favorite as SpecialContentsType[]) ?? []);

    // console.log(bookmarkContents, data, bookmarkContents.includes(data));

    //{type:contentType,id:data}
    setIsBookmark(
      bookmarkContents.some((e) => e.id == data && e.type == contentType)
    );
    setIsFavorite(
      favoriteContents.some((e) => e.id == data && e.type == contentType)
    );
  }, [bookmarkContents, favoriteContents, content, contentType]);

  if (contentStore.isLoading) {
    return <SkeletonDetail />;
  }

  return (
    <>
      <div className="relative bg-[var(--primary-bg)] text-[var(--text)] p-4  hidden md:block">
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
        <div className="relative z-10 py-5 px-7 h-full w-full">
          <div className="flex">
            <div
              className="p-3 bg-[var(--secondary-bg)] rounded-full hover:opacity-85"
              onClick={handleBack}
            >
              <ChevronLeft />
            </div>
          </div>
          <div className="flex mt-5 gap-3">
            <div className="w-[300px] rounded-2xl overflow-hidden relative">
              <div
                onClick={async () => {
                  if (isFavorite) {
                    setIsFavorite(false);

                    let data = await contentListToggle({
                      type: "favorite",
                      flag: contentType,
                      id: content.id,
                      isAdd: false,
                    });
                    if (!data.success) {
                      setIsFavorite(true);
                    }
                  } else {
                    setIsFavorite(true);

                    let data = await contentListToggle({
                      type: "favorite",
                      flag: contentType,
                      id: content.id,
                      isAdd: true,
                    });
                    if (!data.success) {
                      setIsFavorite(false);
                    }
                  }
                }}
                className="absolute z-30 right-2 top-1"
              >
                <Heart
                  className={`text-yellow-400 ${
                    isFavorite ? "fill-[var(--favorite)]" : ""
                  }`}
                />
              </div>
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
              <h1 className=" font-bold text-2xl ">
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
              <div className="flex gap-2 flex-wrap">
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
                  setIsBookmark(false);

                  let data = await contentListToggle({
                    type: "bookmark",
                    flag: contentType,
                    id: content.id,
                    isAdd: false,
                  });
                  if (!data.success) {
                    setIsBookmark(true);
                  }
                } else {
                  setIsBookmark(true);

                  let data = await contentListToggle({
                    type: "bookmark",
                    flag: contentType,
                    id: content.id,
                    isAdd: true,
                  });
                  if (!data.success) {
                    setIsBookmark(false);
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
      <div className="block md:hidden relative  bg-[var(--primary-bg)] text-[var(--text)] py-4">
        <div
          className="fixed top-0 left-0 w-full h-full z-0  "
          style={{
            transform: `translateY(${scrollY * -0.5}px)`, // adjust speed factor
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}
            alt=""
            className="w-full h-3/5 object-cover " // <-- added blur-sm
          />

          <div
            className="absolute top-0 left-0 h-full w-full "
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,${fullMobile}), rgba(0,0,0,1))`,
            }}
          ></div>
        </div>
        <div className="relative z-10   w-full">
          <div className=" w-full flex fixed top-4 justify-between px-4 z-30">
            <div
              className="p-2 bg-[var(--secondary-bg)] rounded-full hover:opacity-85 "
              onClick={handleBack}
            >
              <ChevronLeft size={16} />
            </div>
            <div className="flex gap-1">
              <div
                onClick={async () => {
                  if (isFavorite) {
                    setIsFavorite(false);

                    let data = await contentListToggle({
                      type: "favorite",
                      flag: contentType,
                      id: content.id,
                      isAdd: false,
                    });
                    if (!data.success) {
                      setIsFavorite(true);
                    }
                  } else {
                    setIsFavorite(true);

                    let data = await contentListToggle({
                      type: "favorite",
                      flag: contentType,
                      id: content.id,
                      isAdd: true,
                    });
                    if (!data.success) {
                      setIsFavorite(false);
                    }
                  }
                }}
                className={` bg-[var(--primary-bg)] text-center p-2 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer  hover:bg-[var(--secondary-bg)]/90 `}
              >
                <Heart
                  size={16}
                  className={`text-yellow-400 ${
                    isFavorite ? "fill-[var(--favorite)]" : ""
                  }`}
                />
              </div>
              <div
                onClick={async () => {
                  if (isBookmark) {
                    setIsBookmark(false);

                    let data = await contentListToggle({
                      type: "bookmark",
                      flag: contentType,
                      id: content.id,
                      isAdd: false,
                    });
                    if (!data.success) {
                      setIsBookmark(true);
                    }
                  } else {
                    setIsBookmark(true);

                    let data = await contentListToggle({
                      type: "bookmark",
                      flag: contentType,
                      id: content.id,
                      isAdd: true,
                    });
                    if (!data.success) {
                      setIsBookmark(false);
                    }
                  }
                }}
                className={` bg-[var(--primary-bg)] text-center p-2 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer  hover:bg-[var(--secondary-bg)]/90 `}
              >
                <Bookmark
                  size={16}
                  className={`text-yellow-400 ${
                    isBookmark ? "fill-[var(--primary)]" : ""
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="pt-[420px] ">
            <div
              ref={mobileScrollContentRef}
              className="w-full bg-[#070707]  "
            >
              <div className="text-[var(--text-highlight)] p-1">
                <h1 className=" font-bold text-1xl px-1 ">
                  {"name" in content ? content.name : content.title}
                </h1>
                <div className="flex justify-start gap-1 my-1  text-[.9rem]">
                  <div className="flex gap-1 scale-90">
                    {" "}
                    <Calendar height={20} width={20} className="" />{" "}
                    <span>
                      {"release_date" in content
                        ? content.release_date
                        : content.first_air_date}
                    </span>
                  </div>
                  <div className="flex  gap-1 scale-90">
                    {" "}
                    <Star
                      height={20}
                      width={20}
                      className="text-[var(--primary)]"
                    />{" "}
                    <span>{content.vote_average}</span>
                  </div>
                </div>
                <div className="flex justify-start -translate-x-1 flex-wrap">
                  {content?.genres?.length > 0 &&
                    content?.genres?.map((e) => (
                      <div
                        key={e.id}
                        className="bg-[var(--secondary-bg)] py-1 px-3 scale-80 rounded-full"
                      >
                        {e.name}
                      </div>
                    ))}
                </div>
              </div>
              <div>

              <div className="sticky top-15">
                <div className="w-full px-5 flex justify-between items-center ">
                  <div
                    onClick={() => setMobileCurrentTab("review")}
                    className={`flex flex-col gap-1 justify-center items-center ${
                      mobileCurrentTab == "review"
                        ? "border-b-3 border-[var(--primary)]"
                        : ""
                    }`}
                  >
                    <Info size={18} />
                    <h1 className="text-[.9rem]">review</h1>
                  </div>
                  <div
                    onClick={() => setMobileCurrentTab("watch")}
                    className={`flex flex-col gap-1 justify-center items-center ${
                      mobileCurrentTab == "watch"
                        ? "border-b-3 border-[var(--primary)]"
                        : ""
                    }`}
                  >
                    <Play size={18} />
                    <h1 className="text-[.9rem]">Watch</h1>
                  </div>
                  <div
                    onClick={() => setMobileCurrentTab("explore")}
                    className={`flex flex-col gap-1 justify-center items-center ${
                      mobileCurrentTab == "explore"
                        ? "border-b-3 border-[var(--primary)]"
                        : ""
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <h1 className="text-[.9rem]">Explore</h1>
                  </div>
                </div>
                <div className="overflow-x-hidden">
                 {mobileCurrentTab == 'review' &&  <div className="scale-90">
                   {content && <> <h1 className="text-[var(--text-highlight)] font-bold text-1xl">
                      {"title" in content ? content.title : content.name}
                    </h1>
                    <p>{content?.tagline}</p>
                    <p className="text-[1.1rem] my-4">{content.overview}</p>
                    <p>
                      Genres - {content?.genres?.length > 0 ? content?.genres.map((e) => e.name).join(", ") : '-'}
                    </p>
                    <p>
                      Release Date -{" "}
                      {"release_date" in content
                        ? content?.release_date
                        : content?.first_air_date}
                    </p>
                    <p>Original Country - {content?.origin_country}</p>
                    <p>Popularity - {content?.popularity}</p>

                    <a
                      className="my-2 underline text-blue-500"
                      href={content?.homepage as string}
                      target="_blank"
                    >
                      {content.homepage}
                    </a></>}
                  </div>}
                  {mobileCurrentTab == 'explore' && <div className="w-full grid grid-cols-3 gap-4 p-3">
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
             
                    </div>}
                      {mobileCurrentTab == 'watch' && <div>
                 {premiumDay > 0 ? (
                    <div className="flex flex-col justify-center items-center gap-3 p-3">
                      
                      <div className="border-1 border-gray-500 p-3 text-center full hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                        Stream 1080P
                      </div>
                      <div className="border-1 border-gray-500 p-3 text-center full hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                        Stream 720P
                      </div>
                      <div className="border-1 border-gray-500 p-3 text-center full hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                        Stream 720P
                      </div>
                      <div className="border-1 border-gray-500 p-3 text-center full hover:bg-[var(--primary)]/60 rounded-2xl select-none cursor-pointer hover:text-[var(--text-highlight)]">
                        Stream 720P
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[300px] flex flex-col justify-center items-center text-left scale-100">
                      <h1 className="text-3xl">Get Premium</h1>
                      <div>
                        <h1 className="ps-3">- 4K resolution</h1>
                        <h1 className="ps-3">- Easy To Watch</h1>
                        <h1 className="ps-3">- One Click Download</h1>
                      </div>
                    </div>
                  )}
                </div>}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
