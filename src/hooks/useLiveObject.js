import { useState, useEffect } from 'react';

// TODO add errors handling
const useLiveObject = (
  createLiveObject,
  defaultData,
  skipEffectCondition = () => false,
  dependencies = [],
) => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if (skipEffectCondition()) {
      return;
    }
    const liveObject = createLiveObject();
    liveObject.model && setData(liveObject.model);
    liveObject.on('dataUpdated', setData);
    return () => liveObject.dispose();
  }, [...dependencies]);

  return data;
};

export default useLiveObject;
