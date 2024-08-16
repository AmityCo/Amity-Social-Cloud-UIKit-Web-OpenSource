import { RefObject, useEffect, useState } from 'react';

interface UseVisibilitySensorProps {
  threshold: number;
  elementRef: RefObject<HTMLDivElement>;
}

export const useVisibilitySensor = ({ threshold, elementRef }: UseVisibilitySensorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          setIsVisible(isIntersecting);
        });
      },
      {
        threshold: threshold,
      },
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, elementRef]);

  return { isVisible };
};
