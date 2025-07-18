import { useEffect } from 'react';

const useIntersectionObserver = ({
  node,
  onIntersect,
  onLeave,
  options,
}: {
  node?: HTMLElement | null;
  onIntersect: () => void;
  onLeave?: () => void;
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
  }, [node, onIntersect, options, onLeave]);
};

export default useIntersectionObserver;
