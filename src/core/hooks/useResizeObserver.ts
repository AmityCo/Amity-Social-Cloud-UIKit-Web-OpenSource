import { useEffect, useRef } from 'react';

const useResizeObserver = (target: any, onResize: any) => {
  const prevSize = useRef({ height: 0, width: 0 });

  useEffect(() => {
    if (target) {
      const observer = new MutationObserver(() => {
        const { height, width } = target.getBoundingClientRect();
        if (height !== prevSize.current.height || width !== prevSize.current.width) {
          prevSize.current = { height, width };
          onResize({ height, width });
        }
      });

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
