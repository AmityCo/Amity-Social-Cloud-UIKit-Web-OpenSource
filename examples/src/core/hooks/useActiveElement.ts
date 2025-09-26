import { useEffect, useState, useRef, MutableRefObject } from 'react';

const useActiveElement = (
  defaultValue = false,
): [MutableRefObject<HTMLDivElement | null>, boolean] => {
  const [isActiveElement, setIsActiveElement] = useState(defaultValue);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const handleClick = (ev: MouseEvent) => {
        setIsActiveElement(
          element.contains(ev.target as HTMLDivElement) ||
            document.activeElement === element ||
            ev.target === element,
        );
      };
      document.addEventListener('mousedown', handleClick);

      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [ref.current]);

  return [ref, isActiveElement];
};

export default useActiveElement;
