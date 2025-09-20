import MovieCardSkeleton from "./MovieCardSkeleton";

type IndexSkeletonPropType = {
    titles : string[]
}

const IndexSkeleton = ({titles} : IndexSkeletonPropType) => {
  return (
    <div>
      
      {titles.map((e,i) => (
        <div key={`homeTitle${i}`} className="px-2">
      {e ? <h1 className=" text-[var(--text-highlight)] mt-2 font-bold text-md">
        {e}
      </h1>: (  <div className="h-6 w-36 bg-gray-700 rounded-md animate-pulse mb-2 mt-2" />)}
      <div className="w-[100%] flex overflow-x-scroll flex-nowrap py-2 md:py-4 gap-2 md:gap-5 scrollbar-hide px-4 ">
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
