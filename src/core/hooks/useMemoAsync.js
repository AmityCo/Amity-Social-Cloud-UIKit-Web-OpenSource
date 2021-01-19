import { useEffect, useState } from 'react';

function useMemoAsync(factory, deps = []) {
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    factory().then(setValue);
  }, deps);

  return value;
}

export default useMemoAsync;
