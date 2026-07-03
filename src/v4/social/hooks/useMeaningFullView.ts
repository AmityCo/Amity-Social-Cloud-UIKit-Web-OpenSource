import { useEffect, useRef } from 'react';

type Options = {
  node: HTMLElement | null;
  onMeaningfulView: () => void;
  thresholdRatio?: number;
  dwellMs?: number;
};

export function useMeaningFullView({
  node,
  onMeaningfulView,
  thresholdRatio = 0.5,
  dwellMs = 500,
}: Options) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!node || firedRef.current) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= thresholdRatio) {
          if (timer) return;
          timer = setTimeout(() => {
            if (!firedRef.current) {
              firedRef.current = true;
              onMeaningfulView();
            }
            observer.disconnect();
          }, dwellMs);
        } else if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: [thresholdRatio] },
    );

    observer.observe(node);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [node, onMeaningfulView, thresholdRatio, dwellMs]);
}
