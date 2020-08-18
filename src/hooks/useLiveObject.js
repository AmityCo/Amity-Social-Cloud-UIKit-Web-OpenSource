import React, { useState, useEffect } from 'react';

// TODO add errors handling
const useLiveObject = (createLiveObject, defaultData) => {
  const [data, setData] = useState(defaultData);
  useEffect(() => {
    const liveObject = createLiveObject();
    liveObject.model && setData(liveObject.model);
    liveObject.on('dataUpdated', setData);
    return () => liveObject.dispose();
  }, []);

  return data;
};

export default useLiveObject;
