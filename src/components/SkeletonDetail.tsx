import { ChevronLeft } from 'lucide-react';
// import React from 'react'
// import IndexSkeleton from './IndexSkeleton';
import MovieCardSkeleton from './MovieCardSkeleton';

const SkeletonDetail = () => {
 return (
     <div className="relative bg-[var(--primary-bg)] text-[var(--text)]  p-4">
      {/* Fixed Background Skeleton */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <div className="w-full h-full bg-gray-700 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/80"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 py-5 px-7">
        {/* Back button */}
        <div className="flex">
          <div className="p-3 bg-gray-700 rounded-full animate-pulse">
            <ChevronLeft className="text-gray-500" />
          </div>
        </div>

        <div className="flex mt-5 gap-3">
          {/* Poster skeleton */}
          <div className="w-[300px] h-[440px] rounded-2xl bg-gray-700 animate-pulse" />

          {/* Right section */}
          <div className="text-[var(--text-highlight)] p-2 flex flex-col gap-4">
            {/* Title */}
            <div className="h-7 w-48 bg-gray-700 rounded-md animate-pulse" />

            {/* Meta info (date + rating) */}
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-10 bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Genres */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <div className="w-[200px] h-12 bg-gray-700 rounded-full animate-pulse" />
          <div className="w-[200px] h-12 bg-gray-700 rounded-full animate-pulse" />
          <div className="w-[200px] h-12 bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Season buttons */}
        {/* <div className="flex gap-3 mt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-yellow-600/50 rounded-full animate-pulse"
            />
          ))}
        </div> */}
        <div className=' mt-6'>

    <div className="h-7 w-36 bg-gray-700 rounded-md animate-pulse" />
        
    
      <div className="w-full flex overflow-x-scroll flex-nowrap py-4 pt-8 gap-5 scrollbar-hide px-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonDetail