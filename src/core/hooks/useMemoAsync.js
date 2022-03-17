import { useEffect, useState } from 'react';

function useMemoAsync(factory, deps = []) {
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    let disposed = false;

    factory().then((newValue) => {
      if (!disposed) {
        setValue(newValue);
      }
    });

    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}

export default useMemoAsync;
