const MovieCardSkeleton = () => {
  return (
    <div className="group shrink-1 md:shrink-0 min-w-[100px] sm:min-w-[140px] md:w-[260px] lg:w-[290px] cursor-pointer">
      {/* Poster Box */}
      <div className="bg-[var(--secondary-bg)] rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-hidden relative w-full min-h-[140px] max-h-[270px] sm:min-h-[210px] sm:max-h-[270px] md:min-h-[380px] lg:min-h-[450px]">
          {/* Poster skeleton */}
          <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-md" />
        </div>

        {/* Title + Date (inside for md and up) */}
        <div className="hidden md:block">
          <div className="mt-2 px-2">
            <div className="h-5 w-40 bg-gray-700 rounded-md animate-pulse" />
          </div>
          <div className="mt-2 px-2">
            <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Title + Date (outside box for mobile) */}
      <div className="block md:hidden mt-1">
        <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse mb-1" />
        <div className="h-3 w-12 bg-gray-700 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
