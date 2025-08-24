import { useEffect, useRef, useState } from "react";

type UseInfiniteFetchProps = {
  dataLength: number; // length of the array
  fetchMore: () => Promise<void> | void; // function to fetch next page
};

export const useInfiniteFetch = ({ dataLength, fetchMore }: UseInfiniteFetchProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lastElementRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          await fetchMore();
          setLoading(false);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(lastElementRef.current);

    return () => {
      if (lastElementRef.current) observer.unobserve(lastElementRef.current);
    };
  }, [dataLength, fetchMore, loading]);

  return lastElementRef;
};
