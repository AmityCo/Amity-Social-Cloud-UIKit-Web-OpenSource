// TODO add errors handling
import { useState, useEffect } from 'react';
import { useSDK } from '~/core/hocs/withSDK';

const useLiveObject = (
  createLiveObject,
  dependencies = [],
  resolver = () => dependencies.some((dep) => !dep),
) => {
  const { connected } = useSDK();
  const [data, setData] = useState({});

  useEffect(() => {
    if (resolver()) return;

    const liveObject = createLiveObject();
    liveObject.model && setData(liveObject.model);
    liveObject.on('dataUpdated', setData);

    return () => liveObject.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, ...dependencies]);

  return data;
};

export default useLiveObject;
