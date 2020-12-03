import { useEffect } from 'react';

const useKeyboard = (listeners = {}, params = {}) => {
  useEffect(() => {
    const listener = e => {
      if (params.ignoreOtherKeys) {
        e.preventDefault();
      }
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
