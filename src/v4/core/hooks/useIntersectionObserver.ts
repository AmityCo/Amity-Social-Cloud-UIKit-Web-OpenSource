import { MutableRefObject, useEffect } from 'react';

const useIntersectionObserver = ({
  ref,
  onIntersect,
  options,
}: {
  ref: MutableRefObject<HTMLElement | null>;
  onIntersect: () => void;
  options?: IntersectionObserverInit;
}) => {
  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onIntersect(),
      options,
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, onIntersect, options]);
};

export default useIntersectionObserver;
