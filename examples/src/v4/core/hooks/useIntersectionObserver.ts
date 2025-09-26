import { useEffect } from 'react';

const useIntersectionObserver = ({
  node,
  onIntersect,
  options,
}: {
  node?: HTMLElement | null;
  onIntersect: () => void;
  options?: IntersectionObserverInit;
}) => {
  useEffect(() => {
    if (node == null) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onIntersect(),
      options,
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [node, onIntersect, options]);
};

export default useIntersectionObserver;
