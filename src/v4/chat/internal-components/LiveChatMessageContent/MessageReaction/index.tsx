import React, { useCallback, useRef, useEffect, useLayoutEffect, useState } from 'react';
import { MessageQuickReaction } from '~/v4/chat/components/MessageQuickReaction';
import { MessageReactionPicker } from '~/v4/chat/components/MessageReactionPicker';
import { convertRemToPx, getCssVariableValue } from '~/v4/helpers/utils';
import styles from './styles.module.css';

export const MessageReaction = ({
  pageId = '*',
  componentId = '*',
  message,
  containerRef,
}: {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  containerRef?: React.RefObject<HTMLDivElement>;
}) => {
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);

  const [isHoveredQuickReaction, setIsHoveredQuickReaction] = useState(false);
  const [isHoveredReactionPicker, setIsHoveredReactionPicker] = useState(false);

  const [transform, setTransform] = React.useState<string>('translate(-50%, 0px)');
  const ref = useRef<HTMLDivElement | null>(null);

  const isHoveredQuickReactionRef = useRef(isHoveredQuickReaction);

  useEffect(() => {
    isHoveredQuickReactionRef.current = isHoveredQuickReaction;
  }, [isHoveredQuickReaction]);

  const onOpenPicker = useCallback(() => {
    if (!isHoveredQuickReactionRef.current) return;

    const timeoutId = setTimeout(() => {
      if (isHoveredQuickReactionRef.current) {
        setIsReactionPickerOpen(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const isHoveredReactionPickerRef = useRef(isHoveredReactionPicker);

  useEffect(() => {
    isHoveredReactionPickerRef.current = isHoveredReactionPicker;
  }, [isHoveredReactionPicker]);

  const onClosePicker = useCallback(() => {
    setTimeout(() => {
      if (!isHoveredReactionPickerRef.current) {
        setIsReactionPickerOpen(false);
      }
    }, 1000);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsReactionPickerOpen(false);
    }
  }, []);

  const calculateTransform = useCallback(() => {
    if (!ref.current || !containerRef?.current) return 'translate(-50%, 0px)';

    const parentRect = containerRef.current.getBoundingClientRect();
    const pickerRect = ref.current.getBoundingClientRect();

    if (!parentRect || !pickerRect) return 'translate(-50%, 0px)';

    const padding = convertRemToPx(
      Number(getCssVariableValue('--asc-spacing-s1').replace('rem', '')),
    );

    const overflowRight = pickerRect.right - parentRect.right;
    const overflowLeft = parentRect.left - pickerRect.left;

    if (overflowRight > 0) {
      // If overflowing to the right, pull it back in (plus a small edge gap)
      return `translate(calc(-50% - ${overflowRight + padding}px), 0px)`;
    } else if (overflowLeft > 0) {
      // If overflowing to the left, push it back in (plus a small edge gap)
      return `translate(calc(-50% + ${overflowLeft + padding}px), 0px)`;
    } else {
      // If not overflowing, keep the original transform
      return 'translate(-50%, 0px)';
    }
  }, [containerRef]);

  // Clamp the picker within the chat container once it has mounted (and on resize).
  // calculateTransform must run after the picker element exists so it can be measured;
  // doing it during render (when ref is still null) skips the overflow correction and
  // leaves the centered picker cut off near the chat edges — most visibly on narrow
  // (mobile) screens where messages sit close to the left edge.
  useLayoutEffect(() => {
    if (!isReactionPickerOpen) return;

    const updateTransform = () => setTransform(calculateTransform());
    updateTransform();

    window.addEventListener('resize', updateTransform);
    return () => window.removeEventListener('resize', updateTransform);
  }, [isReactionPickerOpen, calculateTransform]);

  const onMouseDown = (event: any) => {
    handleClickOutside(event);
  };

  const onSelectReaction = () => {
    setIsHoveredQuickReaction(false);
    setIsHoveredReactionPicker(false);
    setIsReactionPickerOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isHoveredQuickReaction) {
      !isReactionPickerOpen && onOpenPicker();
    } else {
      isReactionPickerOpen && onClosePicker();
    }
  }, [isHoveredQuickReaction, isReactionPickerOpen]);

  return (
    <div className={styles.reactionContainer}>
      {isReactionPickerOpen && (
        <div
          className={styles.reactionPickerWrap}
          style={{ transform }}
          ref={ref}
          onMouseEnter={() => setIsHoveredReactionPicker(true)}
          onMouseLeave={() => {
            setIsHoveredReactionPicker(false);
          }}
        >
          <MessageReactionPicker message={message} onSelectReaction={onSelectReaction} />
        </div>
      )}

      <div
        className={styles.reactionButton}
        onMouseEnter={() => {
          setIsHoveredQuickReaction(true);
        }}
        onMouseLeave={() => {
          setIsHoveredQuickReaction(false);
        }}
      >
        <MessageQuickReaction
          message={message}
          onSelectReaction={onSelectReaction}
          pageId={pageId}
          componentId={componentId}
        />
      </div>
    </div>
  );
};
