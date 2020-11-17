import { useEffect } from 'react';

const useKeyboard = (listeners = {}) => {
  useEffect(() => {
    const listener = e => {
      if (e.key in listeners) {
        e.preventDefault();
        listeners[e.key](e);
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [listeners]);
};

export default useKeyboard;
