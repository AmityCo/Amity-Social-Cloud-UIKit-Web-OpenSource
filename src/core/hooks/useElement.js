import { useEffect, useState, useRef } from 'react';

const useElement = () => {
  const [element, setElement] = useState();
  const ref = useRef();

  useEffect(() => ref.current && setElement(ref.current), [ref.current]);

  return [ref, element];
};

export default useElement;
