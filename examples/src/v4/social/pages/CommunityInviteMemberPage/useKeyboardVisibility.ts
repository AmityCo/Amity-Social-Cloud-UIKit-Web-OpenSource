import { useState, useLayoutEffect, useCallback, useRef } from 'react';

export const useKeyboardVisibility = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const isClosingRef = useRef(false);
  const isOpeningRef = useRef(false);

  const handleInputFocus = useCallback(() => {
    isOpeningRef.current = true;
    isClosingRef.current = false;
  }, []);

  const handleInputBlur = useCallback(() => {
    isClosingRef.current = true;
    isOpeningRef.current = false;
    setKeyboardOffset(0);

    setTimeout(() => {
      isClosingRef.current = false;
    }, 300);
  }, []);

  const handleResize = useCallback(() => {
    if (window.visualViewport && !isClosingRef.current) {
      const { height } = window.visualViewport;
      const windowHeight = window.innerHeight;
      const offset = Math.max(0, windowHeight - height);

      if (isOpeningRef.current || offset > 0) {
        setKeyboardOffset(offset);

        if (isOpeningRef.current && offset > 0) {
          isOpeningRef.current = false;
        }
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (!window.visualViewport) return;

    handleResize();

    document.addEventListener('focusin', handleInputFocus);
    document.addEventListener('focusout', handleInputBlur);
    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('focusin', handleInputFocus);
      document.removeEventListener('focusout', handleInputBlur);
      if (!window.visualViewport) return;
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, [handleResize, handleInputFocus, handleInputBlur]);

  return { keyboardOffset };
};
