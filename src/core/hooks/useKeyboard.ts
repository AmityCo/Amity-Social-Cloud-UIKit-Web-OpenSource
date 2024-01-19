import { useEffect } from 'react';

const useKeyboard = (keyCode: string, listener: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (e.key === keyCode) {
        e.preventDefault();
        listener(e);
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [listener]);

  return {
    removeEventListener: () => document.removeEventListener('keydown', listener),
  };
};

export default useKeyboard;
