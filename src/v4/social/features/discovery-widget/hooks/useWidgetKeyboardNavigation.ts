import { KeyboardEvent, RefObject, useCallback, useRef, useState } from 'react';
import { prefersReducedMotion } from '~/v4/utils/prefersReducedMotion';

export function useWidgetKeyboardNavigation(count: number, trackRef: RefObject<HTMLElement>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const focusCard = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(count - 1, index));
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);

      const card = cardRefs.current[clamped];
      if (!card) return;

      card.focus({ preventScroll: true });

      const track = trackRef.current;
      if (!track) return;

      const cardRect = card.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const cardLeftInTrack = cardRect.left - trackRect.left + track.scrollLeft;
      const target = cardLeftInTrack + cardRect.width / 2 - track.clientWidth / 2;
      track.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [count, trackRef],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          focusCard(activeIndexRef.current + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          focusCard(activeIndexRef.current - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusCard(0);
          break;
        case 'End':
          event.preventDefault();
          focusCard(count - 1);
          break;
      }
    },
    [count, focusCard],
  );

  const getCardTabIndex = useCallback(
    (index: number) => {
      const effective = Math.max(0, Math.min(activeIndex, count - 1));
      return index === effective ? 0 : -1;
    },
    [activeIndex, count],
  );

  const setCardRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      cardRefs.current[index] = element;
    },
    [],
  );

  return { getCardTabIndex, setCardRef, onKeyDown };
}
