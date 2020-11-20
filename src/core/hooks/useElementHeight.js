import { useEffect, useRef, useState } from 'react';

const useElementHeight = () => {
  const [height, setHeight] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const currentHeight = ref.current?.getBoundingClientRect().height;
    // prevent extra render
    if (currentHeight !== undefined && currentHeight !== height) {
      setHeight(currentHeight);
    }
  }, [ref.current]);

  return [ref, height];
};

export default useElementHeight;
