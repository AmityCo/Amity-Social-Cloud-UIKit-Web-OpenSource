import { useEffect, useState } from 'react';

function useMemoAsync(factory: any, deps = []) {
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    let disposed = false;

    factory().then((newValue: any) => {
      if (!disposed) {
        setValue(newValue);
      }
    });

    return () => {
      disposed = true;
    };
  }, deps);

  return value;
}

export default useMemoAsync;
