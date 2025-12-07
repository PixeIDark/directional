import { useEffect, useRef } from "react";

interface UseInfiniteScrollParams {
  fetcher: () => void;
  enabled: boolean;
}

export function useInfiniteScroll({ fetcher, enabled }: UseInfiniteScrollParams) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && enabled) fetcher();
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [enabled, fetcher]);

  return { observerRef };
}
