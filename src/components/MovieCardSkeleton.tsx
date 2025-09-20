const MovieCardSkeleton = () => {
  return (
    <div className="group shrink-1 md:shrink-0 min-w-[100px] sm:min-w-[140px] md:w-[260px] lg:w-[260px] cursor-pointer">
      {/* Poster Box */}
      <div className="bg-[var(--secondary-bg)] rounded-[10px] overflow-hidden shadow-sm transform transition-transform duration-200">
        <div className="overflow-hidden relative w-full min-h-[160px] max-h-[300px] sm:min-h-[210px] sm:max-h-[270px] md:min-h-[380px] lg:min-h-[430px]">
          {/* Poster skeleton */}
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
        </div>

        {/* Title + Date (inside box for md and up) */}
        <div className="hidden md:block">
          <div className="px-2 pt-2">
            <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="px-2 pb-2 mt-2">
            <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Title + Date (outside box for mobile) */}
      <div className="block md:hidden mt-1">
        <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse mb-1" />
        <div className="h-3 w-12 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
