import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultPoster from "../assets/default_img.png"; // fallback image
import ConfirmBox from "./ConfirmBox";

type MovieCardProp = {
  id: number;
  poster: string | null;
  title: string;
  date: string;
  content: "movie" | "tv";
  needConfirm?:boolean
};

const MovieCard = ({ content, id, poster, title, date ,needConfirm = false }: MovieCardProp) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    poster ? `https://image.tmdb.org/t/p/w500${poster}` : defaultPoster
  );
const [boxOpen,setBoxOpen] = useState(false)

  return (
    <div
      onClick={() => {
        if(needConfirm){
          setBoxOpen(true)
        }else{
          navigate(`/detail/${id}?content=${content}`)
        }
      }}
      // onClick={() => navigate(`/detail/${id}?content=${content}`)}
      className="group shrink-1 md:shrink-0 min-w-[100px] sm:min-w-[140px] md:w-[260px] lg:w-[260px] cursor-pointer"
    >
      {needConfirm  && <ConfirmBox isOpen={boxOpen} onClose={() => setBoxOpen(false)} onDelete={() => {
      
        setBoxOpen(false)
      }} onDetail={() => navigate(`/detail/${id}?content=${content}`)}/>}
      {/* Poster Box */}
      <div className="bg-[var(--secondary-bg)] rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200 hover:scale-105">
        <div className="overflow-hidden relative w-full min-h-[140px] max-h-[270px] sm:min-h-[210px] sm:max-h-[270px] md:min-h-[380px] lg:min-h-[430px]">
          {/* Skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md min-h-[140px] max-h-[270px] sm:min-h-[210px] sm:max-h-[270px] md:min-h-[380px] lg:min-h-[430px]" />
          )}

          <img
            src={imgSrc}
            alt={title}
            className={`w-full h-full object-cover rounded-md transition-all duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-110 transform`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImgSrc(defaultPoster)}
          />
        </div>

        {/* Title + Date (inside box only for md and up) */}
        <div className="hidden md:block">
          <h1 className="truncate w-full px-2 pt-2 text-[1rem] text-[var(--text-highlight)]">
            {title}
          </h1>
          <h1 className="px-2 pb-2 text-sm">{date && date?.split("-")[0]}</h1>
        </div>
      </div>

      {/* Title + Date (outside box on mobile) */}
      <div className="block md:hidden mt-1">
        <h1 className="truncate w-full text-[0.8rem] text-[var(--text-highlight)]">
          {title}
        </h1>
        <h1 className="text-xs">{date && date?.split("-")[0]}</h1>
      </div>
    </div>
  );
};

export default MovieCard;
