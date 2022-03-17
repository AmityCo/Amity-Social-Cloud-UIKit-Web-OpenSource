import { useEffect, useRef, useState } from 'react';

import useResizeObserver from '~/core/hooks/useResizeObserver';

const useElementSize = () => {
  const ref = useRef();

  const [size, setSize] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const { height, width } = element.getBoundingClientRect();
      const sizeExists = [height, width].every((item) => item !== undefined);
      const sizeChanged = height !== size.height || width !== size.width;

      // prevent extra render
      if (sizeExists && sizeChanged) {
        setSize({
          height,
          width,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  useResizeObserver(ref.current, setSize);

  return [ref, size.height, size.width];
};

export default useElementSize;
