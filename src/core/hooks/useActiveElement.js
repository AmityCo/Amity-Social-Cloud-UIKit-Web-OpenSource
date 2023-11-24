import { useEffect, useState, useRef } from 'react';

const useActiveElement = (defaultValue = false) => {
  const [isActiveElement, setIsActiveElement] = useState(defaultValue);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const handleClick = (e) => {
        setIsActiveElement(
          element.contains(e.target) || document.activeElement === element || e.target === element,
        );
      };
      document.addEventListener('mousedown', handleClick);

      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [ref.current]);

  return [ref, isActiveElement];
};

export default useActiveElement;
