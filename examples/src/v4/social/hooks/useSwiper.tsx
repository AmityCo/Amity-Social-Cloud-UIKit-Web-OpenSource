import { useRef } from 'react';

type useSwiperParams = {
  next: () => void;
  prev: () => void;
  threshold?: number;
};

export default function useSwiper({ next, prev, threshold = 50 }: useSwiperParams) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > threshold) next();
    if (distance < -threshold) prev();
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
