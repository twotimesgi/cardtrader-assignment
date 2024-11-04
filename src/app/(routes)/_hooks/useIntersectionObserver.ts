import { useRef, useEffect } from "react";

const useIntersectionObserver = (callback: () => void, hasNextPage: boolean) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      if (!loaderRef.current || !hasNextPage) return;
  
      const observer = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && callback(),
        { threshold: 0.1 }
      );
  
      observer.observe(loaderRef.current);
      return () => observer.disconnect();
    }, [callback, hasNextPage]);
  
    return loaderRef;
  };

  export {useIntersectionObserver}