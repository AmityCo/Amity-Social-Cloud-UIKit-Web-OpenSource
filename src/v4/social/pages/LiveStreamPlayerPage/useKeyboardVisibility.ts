import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Enhanced useKeyboardVisibility.ts
export const useKeyboardVisibility = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const isClosingRef = useRef(false);
  const isOpeningRef = useRef(false);

  const handleInputFocus = useCallback(() => {
    isOpeningRef.current = true;
    isClosingRef.current = false;

    // Store original height when input is focused
    if (originalHeight === 0) {
      setOriginalHeight(window.innerHeight);
    }
  }, [originalHeight]);

  const handleInputBlur = useCallback(() => {
    isClosingRef.current = true;
    isOpeningRef.current = false;
    setKeyboardOffset(0);

    setTimeout(() => {
      isClosingRef.current = false;
    }, 300);
  }, []);

  const handleResize = useCallback(() => {
    if (!window.visualViewport || isClosingRef.current) return;

    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const bottomInset = isiOS ? 240 : 0;

    // ✅ More accurate calculation
    const windowOffset = window.innerHeight - window.visualViewport.height;
    const calculatedOffset = windowOffset + (windowOffset ? bottomInset : 0);

    // ✅ Only set offset if it's significant and input is focused
    if (calculatedOffset > 100 && isOpeningRef.current) {
      // Higher threshold
      setKeyboardOffset(calculatedOffset);
    } else if (calculatedOffset <= 50) {
      setKeyboardOffset(0);
    }
  }, [originalHeight]);

  useLayoutEffect(() => {
    if (!window.visualViewport) {
      // Fallback for browsers without visualViewport
      const handleWindowResize = () => {
        const currentHeight = window.innerHeight;
        const heightDiff = originalHeight - currentHeight;

        if (heightDiff > 150 && isOpeningRef.current) {
          setKeyboardOffset(heightDiff);
        } else if (heightDiff <= 50) {
          setKeyboardOffset(0);
        }
      };

      window.addEventListener('resize', handleWindowResize);
      document.addEventListener('focusin', handleInputFocus);
      document.addEventListener('focusout', handleInputBlur);

      return () => {
        window.removeEventListener('resize', handleWindowResize);
        document.removeEventListener('focusin', handleInputFocus);
        document.removeEventListener('focusout', handleInputBlur);
      };
    }

    // Store initial height
    setOriginalHeight(window.innerHeight);
    handleResize();

    document.addEventListener('focusin', handleInputFocus);
    document.addEventListener('focusout', handleInputBlur);
    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('focusin', handleInputFocus);
      document.removeEventListener('focusout', handleInputBlur);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [handleResize, handleInputFocus, handleInputBlur]);

  return { keyboardOffset, isKeyboardOpen: keyboardOffset > 100 };
};
