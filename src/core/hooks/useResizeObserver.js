import { useEffect } from 'react';

const useResizeObserver = (target, onResize) => {
  useEffect(() => {
    if (target) {
      const observer = new MutationObserver(() => {
        const { height, width } = target.getBoundingClientRect();
        onResize({ height, width });
      });

      // const { current: currentObserver } = observer;
      observer.observe(target, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [onResize, target]);
};

export default useResizeObserver;
