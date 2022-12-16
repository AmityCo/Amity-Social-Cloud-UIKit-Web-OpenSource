import { useEffect } from 'react';

const useResizeObserver = (target, onResize) => {
  useEffect(() => {
    if (target) {
      try {
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
      } catch (_e) {
        // This can be safely ignored
      }
    }
  }, [onResize, target]);
};

export default useResizeObserver;
