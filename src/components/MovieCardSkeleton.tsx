const MovieCardSkeleton = () => {
  return (
    <div className="shrink-0 w-[260px] bg-[var(--secondary-bg)] pb-4 rounded-[10px] overflow-hidden shadow-sm cursor-pointer">
      {/* Poster */}
      <div className="w-full h-[360px] bg-gray-700 animate-pulse" />

      {/* Title */}
      <div className="mt-2 px-2">
        <div className="h-5 w-40 bg-gray-700 rounded-md animate-pulse" />
      </div>

      {/* Date */}
      <div className="mt-2 px-2">
        <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
