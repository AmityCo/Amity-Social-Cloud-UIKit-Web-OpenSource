import { LoadingStatus } from '@amityco/js-sdk';
import { throttle } from 'lodash';
import { useEffect, useState } from 'react';
import { useSDK } from '~/core/hooks/useSDK';

const noop = () => {
  if (process?.env?.NODE_ENV === 'development') console.warn('[useLiveCollection] noop hit');
};

const useLiveCollection = (
  createLiveCollection,
  dependencies = [],
  resolver = () => dependencies.some((dep) => !dep),
  debug = null,
) => {
  const { connected } = useSDK();
  const [data, setData] = useState({
    items: [],
    hasMore: false,
    loadMore: noop,
    loadingFirstTime: true,
    loadingMore: false,
  });

  useEffect(() => {
    if (!connected || resolver()) return;

    const liveCollection = createLiveCollection();
    let loadMoreHasBeenCalled = false;

    const updateLiveCollection = throttle(() => {
      debug && console.log(liveCollection.dataStatus, liveCollection.hasMore);

      const { hasMore = false } = liveCollection;

      setData({
        items: liveCollection.models ?? [],
        hasMore,
        loadMore: hasMore
          ? () => {
              loadMoreHasBeenCalled = true;
              liveCollection.nextPage();
            }
          : noop,
        loadingFirstTime:
          !loadMoreHasBeenCalled && liveCollection.loadingStatus === LoadingStatus.Loading,
        loadingMore:
          loadMoreHasBeenCalled && liveCollection.loadingStatus === LoadingStatus.Loading,
      });
    }, 50);

    if (debug) {
      window.lc = liveCollection;
    }

    try {
      liveCollection.on('dataUpdated', () => {
        debug && console.log('dataUpdated!');
        updateLiveCollection();
      });

      liveCollection.on('loadingStatusChanged', (statuses) => {
        debug && console.log('loadingStatusChanged!', statuses);
        updateLiveCollection();
      });

      if (liveCollection.models) {
        debug && console.log('from client cache');
        updateLiveCollection();
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development')
        console.warn('[useLiveCollection] error thrown', err);
    }

    return () => liveCollection.dispose();
  }, [connected, ...dependencies]);

  return [data.items, data.hasMore, data.loadMore, data.loadingFirstTime, data.loadingMore];
};

export default useLiveCollection;
