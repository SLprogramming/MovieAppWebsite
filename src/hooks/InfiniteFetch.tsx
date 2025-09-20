import { useEffect, useRef } from "react";

type UseInfiniteFetchProps = {
  dataLength: number; // length of the array
  fetchMore: () => Promise<void> | void; // function to fetch next page
};

export const useInfiniteFetch = ({ dataLength, fetchMore }: UseInfiniteFetchProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false); // track loading without triggering rerender

  useEffect(() => {
    const current = lastElementRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          Promise.resolve(fetchMore()).finally(() => {
            loadingRef.current = false;
          });
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.6, // trigger when 50% of last item is visible
      }
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [dataLength, fetchMore]); // no loading in dependencies

  return lastElementRef;
};
