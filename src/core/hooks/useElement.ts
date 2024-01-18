import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * @deprecated
 */
const useElement = <T extends HTMLElement>(): [RefObject<T>, T | undefined] => {
  const [element, setElement] = useState<T>();
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      setElement(ref.current);
    }
  }, [ref.current]);

  return [ref, element];
};

export default useElement;
