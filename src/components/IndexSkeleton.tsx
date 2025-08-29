import MovieCardSkeleton from "./MovieCardSkeleton";

type IndexSkeletonPropType = {
    titles : string[]
}

const IndexSkeleton = ({titles} : IndexSkeletonPropType) => {
  return (
    <div>
      
      {titles.map(e => (
        <div key={e}>
      <h1 className="text-[var(--text-highlight)] mt-2 font-bold text-md">
        {e}
      </h1>
      <div className="w-full flex overflow-x-scroll flex-nowrap py-4 gap-5 scrollbar-hide px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
        </div>
      ))}

      
     
    </div>
  );
};

export default IndexSkeleton;
