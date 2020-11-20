import { useRef, useState, useEffect } from 'react';

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.9,
};

const useObserver = (target, options = defaultOptions) => {
  const [entry, setEntry] = useState({});
  const observer = useRef(new IntersectionObserver(entries => setEntry(entries[0]), options));

  useEffect(() => {
    if (target) {
      const { current: currentObserver } = observer;
      currentObserver.observe(target);
      return () => currentObserver.disconnect();
    }
  }, [target]);

  return entry;
};

export default useObserver;
