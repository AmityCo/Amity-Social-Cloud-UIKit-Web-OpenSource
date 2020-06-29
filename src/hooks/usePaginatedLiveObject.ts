import React, { useState, useEffect } from 'react';
import EkoClient, { EkoLoadingStatus } from 'eko-sdk';

const noop = () => null;

const usePaginatedLiveObject = (createLiveObject, defaultData) => {
  const [data, setData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    hasMore: false,
    loadMore: noop,
  });

  useEffect(() => {
    const liveObject = createLiveObject();

    liveObject.on('dataUpdated', setData);

    liveObject.on('loadingStatusChanged', ({ newValue }) => {
      const hasMore = newValue === EkoLoadingStatus.Loaded ? liveObject.hasMore : false;
      setPagination({
        hasMore,
        loadMore: hasMore ? () => liveObject.nextPage() : noop,
      });
    });
    return () => liveObject.dispose();
  }, []);

  return [data, pagination.hasMore, pagination.loadMore];
};

export default usePaginatedLiveObject;
