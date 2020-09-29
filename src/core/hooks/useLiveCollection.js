import { useState, useEffect } from 'react';
import { EkoLoadingStatus } from 'eko-sdk';

const noop = () => null;

const useLiveCollection = (
  createLiveCollection,
  dependencies = [],
  resolver = () => dependencies.some(dep => !dep),
) => {
  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState({
    hasMore: false,
    loadMore: noop,
  });

  useEffect(() => {
    if (resolver()) return;

    const liveCollection = createLiveCollection();

    // data
    liveCollection.models && setData(liveCollection.models);
    liveCollection.on('dataUpdated', setData);

    // pagination
    liveCollection.on('loadingStatusChanged', ({ newValue }) => {
      const hasMore = newValue === EkoLoadingStatus.Loaded && liveCollection.hasMore;

      setPagination({
        hasMore,
        loadMore: hasMore ? () => liveCollection.nextPage() : noop,
      });
    });

    return () => liveCollection.dispose();
  }, [...dependencies]);

  return [data, pagination.hasMore, pagination.loadMore];
};

export default useLiveCollection;
