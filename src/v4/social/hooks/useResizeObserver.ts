import { RefObject, useEffect, useState } from 'react';

export const useResizeObserver = ({ ref }: { ref: RefObject<HTMLDivElement> }) => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.target.clientHeight);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return height;
};
