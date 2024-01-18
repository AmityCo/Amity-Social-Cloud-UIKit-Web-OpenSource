import { useRef, useState, useEffect, useMemo } from 'react';

const defaultOptions = {
  root: null,
  rootMargin: '0px 0px -15% 0px',
  threshold: 0.9,
};

const useObserver = (target, { root, rootMargin, threshold } = defaultOptions) => {
  const options = useMemo(
    () => ({
      root,
      rootMargin: rootMargin || defaultOptions.rootMargin,
      threshold: threshold || defaultOptions.threshold,
    }),
    [root, rootMargin, threshold],
  );
  const [entry, setEntry] = useState({});
  const observer = useRef(new IntersectionObserver((entries) => setEntry(entries[0]), options));

  useEffect(() => {
    if (target) {
      const { current: currentObserver } = observer;
      currentObserver.observe(target);
      return () => currentObserver.disconnect();
    }
  }, [target]);

  useEffect(() => {
    if (target) {
      const { current: currentObserver } = observer;
      currentObserver.unobserve(target);
      observer.current = new IntersectionObserver((entries) => setEntry(entries[0]), options);
      observer.current.observe(target);
      return () => observer.current.disconnect();
    }
  }, [options, rootMargin, target]);

  return entry;
};

export default useObserver;
