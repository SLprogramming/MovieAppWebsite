import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import defaultPoster from '../assets/default_img.png'; // your local default image

type MovieCardProp = {
  id: number;
  poster: string | null;
  title: string;
  date: string;
  content: 'movie' | 'tv';
};

const MovieCard = ({ content, id, poster, title, date = '2012-12-02' }: MovieCardProp) => {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    poster ? `https://image.tmdb.org/t/p/w500${poster}` : defaultPoster
  );

  return (
    <div
      onClick={() => navigate(`/detail/${id}?content=${content}`)}
      className="group shrink-0 w-[260px] bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200 shadow-[white] cursor-pointer hover:scale-105"
    >
      <div className="overflow-hidden relative w-full h-[390px]">
        {/* Skeleton */}
        {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />}
        
        <img
          src={imgSrc}
          alt={title}
          className={`w-full h-full object-cover rounded-md transition-all duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-110 transform`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setImgSrc(defaultPoster)}
        />
      </div>
      <h1 className="truncate w-full px-2 pt-2 text-[1.2rem] text-[var(--text-highlight)]">
        {title}
      </h1>
      <h1 className="px-2 pb-2">{date.split('-')[0]}</h1>
    </div>
  );
};

export default MovieCard;
