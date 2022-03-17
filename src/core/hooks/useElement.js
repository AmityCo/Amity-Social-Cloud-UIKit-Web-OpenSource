import { useEffect, useState, useRef } from 'react';

const useElement = () => {
  const [element, setElement] = useState();
  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => ref.current && setElement(ref.current), [ref.current]);

  return [ref, element];
};

export default useElement;
