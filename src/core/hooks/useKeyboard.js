import { useEffect } from 'react';

const useKeyboard = (listeners = {}, params = {}) => {
  useEffect(() => {
    const listener = (e) => {
      e.stopPropagation();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeners]);
};

export default useKeyboard;
