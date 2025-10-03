import { useCallback, useEffect, useRef, useState } from 'react';
import { useLongPress } from 'react-use';
import { useResponsive } from './useResponsive';

interface UseReactionHandlerOptions {
  myReaction?: string | null;
  hoverDuration?: number;
  longPressDuration?: number;
  onReactionClick: (reactionKey: string) => boolean;
  onHover?: () => void;
  onLongPress?: () => void;
}

interface UseReactionHandlerReturn {
  showReactionPicker: boolean;
  optimisticReaction: string | null;
  isLongPressing: boolean;
  displayReaction: string | null;
  hasMyReaction: boolean;
  hoveredReaction: string | null;
  isTouchDragging: boolean;

  handleReactionPickerSelect: (reactionName: string) => void;
  handleClickOutside: () => void;
  handleMouseEnter: () => void;
  handleCustomMouseLeave: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleQuickReaction: () => void;
  handleReactionHover: (reactionName: string | null) => void;

  longPressEvent: ReturnType<typeof useLongPress>;

  hoverTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const DEFAULT_HOVER_DURATION = 250;
const DEFAULT_LONG_PRESS_DURATION = 500;

export function useReactionHandler({
  myReaction,
  hoverDuration = DEFAULT_HOVER_DURATION,
  longPressDuration = DEFAULT_LONG_PRESS_DURATION,
  onReactionClick,
  onHover,
  onLongPress,
}: UseReactionHandlerOptions): UseReactionHandlerReturn {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPositionRef = useRef<{ x: number; y: number } | null>(null);

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [optimisticReaction, setOptimisticReaction] = useState<string | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const { isDesktop } = useResponsive();

  const displayReaction = optimisticReaction || myReaction || null;
  const hasMyReaction = displayReaction != null;

  useEffect(() => {
    if (optimisticReaction && myReaction === optimisticReaction) {
      setOptimisticReaction(null);
    }
  }, [myReaction, optimisticReaction]);

  const longPressHandler = useCallback(() => {
    setIsLongPressing(true);
    setShowReactionPicker(true);
    onLongPress?.();
  }, [onLongPress]);

  const longPressEvent = useLongPress(longPressHandler, {
    isPreventDefault: true,
    delay: longPressDuration,
  });

  const handleCustomMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (longPressEvent.onMouseLeave) {
      longPressEvent.onMouseLeave();
    }
  }, [longPressEvent.onMouseLeave]);

  const handleMouseEnter = useCallback(() => {
    if (!onHover) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      onHover();
    }, hoverDuration);
  }, [hoverDuration, onHover]);

  const handleReactionPickerSelect = useCallback(
    (reactionName: string) => {
      setShowReactionPicker(false);
      setIsLongPressing(false);
      setHoveredReaction(null);

      if (displayReaction === reactionName) {
        const result = onReactionClick(reactionName);
        result && setOptimisticReaction(null);
        return;
      }

      const result = onReactionClick(reactionName);
      result && setOptimisticReaction(reactionName);
    },
    [onReactionClick, displayReaction],
  );

  const handleClickOutside = useCallback(() => {
    setShowReactionPicker(false);
    setIsLongPressing(false);
    setHoveredReaction(null);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop) return;

      setIsLongPressing(false);
      setIsTouchDragging(false);
      touchStartTimeRef.current = Date.now();
      touchStartPositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }

      longPressTimeoutRef.current = setTimeout(() => {
        setIsLongPressing(true);
        setShowReactionPicker(true);
        setIsTouchDragging(true);
        onLongPress?.();
      }, longPressDuration);
    },
    [longPressDuration, onLongPress, isDesktop],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop || !isLongPressing || !showReactionPicker) return;

      const currentTouch = e.touches[0];
      if (!currentTouch) return;

      e.preventDefault();

      const elementFromPoint = document.elementFromPoint(
        currentTouch.clientX,
        currentTouch.clientY,
      );

      if (elementFromPoint) {
        const reactionButton = elementFromPoint.closest('[data-reaction-name]');
        if (reactionButton) {
          const reactionName = reactionButton.getAttribute('data-reaction-name');
          if (reactionName !== hoveredReaction) {
            setHoveredReaction(reactionName);
          }
        } else {
          const pickerContainer = elementFromPoint.closest('[data-position]');
          if (!pickerContainer && hoveredReaction) {
            setHoveredReaction(null);
          }
        }
      }
    },
    [isDesktop, isLongPressing, showReactionPicker, hoveredReaction],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop) return;

      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      const touchEndTime = Date.now();
      const touchDuration = touchStartTimeRef.current
        ? touchEndTime - touchStartTimeRef.current
        : 0;

      if (isTouchDragging && hoveredReaction && showReactionPicker) {
        handleReactionPickerSelect(hoveredReaction);
        setIsTouchDragging(false);
        setIsLongPressing(false);
        setShowReactionPicker(false);
        setHoveredReaction(null);
      } else if (touchDuration < longPressDuration) {
        setIsLongPressing(false);
        setIsTouchDragging(false);
      }

      touchStartTimeRef.current = null;
      touchStartPositionRef.current = null;
    },
    [
      longPressDuration,
      isDesktop,
      isTouchDragging,
      hoveredReaction,
      showReactionPicker,
      handleReactionPickerSelect,
    ],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktop) return;

      setIsLongPressing(false);
      if (longPressEvent.onMouseDown) {
        longPressEvent.onMouseDown(e as any);
      }
    },
    [longPressEvent.onMouseDown, isDesktop],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktop) return;

      if (longPressEvent.onMouseUp) {
        longPressEvent.onMouseUp();
      }

      if (isLongPressing && hoveredReaction && showReactionPicker) {
        handleReactionPickerSelect(hoveredReaction);
        return;
      }

      setTimeout(() => {
        setIsLongPressing(false);
      }, 100);
    },
    [
      longPressEvent.onMouseUp,
      isDesktop,
      isLongPressing,
      hoveredReaction,
      showReactionPicker,
      handleReactionPickerSelect,
    ],
  );

  // Handle quick reaction (like button click)
  const handleQuickReaction = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    const currentReaction = displayReaction;

    if (currentReaction) {
      const result = onReactionClick(currentReaction);
      result && setOptimisticReaction(null);
    } else {
      const result = onReactionClick('like');
      result && setOptimisticReaction('like');
    }
  }, [displayReaction, onReactionClick]);

  // Handle reaction hover in picker
  const handleReactionHover = useCallback(
    (reactionName: string | null) => {
      if (isDesktop && isLongPressing) {
        setHoveredReaction(reactionName);
      }
    },
    [isDesktop, isLongPressing],
  );

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showReactionPicker, handleClickOutside]);

  useEffect(() => {
    if (isDesktop && isLongPressing && showReactionPicker) {
      const globalMouseUp = (e: MouseEvent) => {
        if (hoveredReaction) {
          handleReactionPickerSelect(hoveredReaction);
        } else {
          setTimeout(() => {
            setIsLongPressing(false);
          }, 100);
        }
      };
      document.addEventListener('mouseup', globalMouseUp);
      return () => {
        document.removeEventListener('mouseup', globalMouseUp);
      };
    }
  }, [isDesktop, isLongPressing, showReactionPicker, hoveredReaction, handleReactionPickerSelect]);

  useEffect(() => {
    if (!isDesktop && isTouchDragging && showReactionPicker) {
      const globalTouchMove = (e: TouchEvent) => {
        const currentTouch = e.touches[0];
        if (!currentTouch) return;

        e.preventDefault();

        const elementFromPoint = document.elementFromPoint(
          currentTouch.clientX,
          currentTouch.clientY,
        );

        if (elementFromPoint) {
          const reactionButton = elementFromPoint.closest('[data-reaction-name]');
          if (reactionButton) {
            const reactionName = reactionButton.getAttribute('data-reaction-name');
            if (reactionName !== hoveredReaction) {
              setHoveredReaction(reactionName);
            }
          } else {
            const pickerContainer = elementFromPoint.closest('[data-position]');
            if (!pickerContainer && hoveredReaction) {
              setHoveredReaction(null);
            }
          }
        }
      };

      document.addEventListener('touchmove', globalTouchMove, { passive: false });
      return () => {
        document.removeEventListener('touchmove', globalTouchMove);
      };
    }
  }, [!isDesktop, isTouchDragging, showReactionPicker, hoveredReaction]);

  return {
    showReactionPicker,
    optimisticReaction,
    isLongPressing,
    displayReaction,
    hasMyReaction,
    hoveredReaction,
    isTouchDragging,

    handleReactionPickerSelect,
    handleClickOutside,
    handleMouseEnter,
    handleCustomMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleMouseDown,
    handleMouseUp,
    handleQuickReaction,
    handleReactionHover,

    longPressEvent,
    hoverTimeoutRef,
  };
}
