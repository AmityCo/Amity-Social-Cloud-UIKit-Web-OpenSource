// TODO add errors handling
import { useState, useEffect } from 'react';

const useLiveObject = (
  createLiveObject,
  dependencies = [],
  resolver = () => dependencies.some((dep) => !dep),
) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (resolver()) return;

    const liveObject = createLiveObject();
    liveObject.model && setData(liveObject.model);
    liveObject.on('dataUpdated', setData);

    return () => liveObject.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return data;
};

export default useLiveObject;
