import { useState, useEffect } from 'react';
import { EkoLoadingStatus } from 'eko-sdk';

const noop = () => null;

const useLiveCollection = (
  createLiveCollection,
  defaultData,
  skipEffectCondition = () => false,
  dependencies = [],
) => {
  const [data, setData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    hasMore: false,
    loadMore: noop,
  });

  useEffect(() => {
    if (skipEffectCondition()) {
      return;
    }
    const liveCollection = createLiveCollection();
    liveCollection.models && setData(liveCollection.models);
    liveCollection.on('dataUpdated', setData);

    liveCollection.on('loadingStatusChanged', ({ newValue }) => {
      const hasMore = newValue === EkoLoadingStatus.Loaded ? liveCollection.hasMore : false;
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
