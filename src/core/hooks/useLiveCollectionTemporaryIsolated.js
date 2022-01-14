// NOTE. DO NOTE USE -TEMPORARY COPY OF useLiveCollection to bypass the bug.
// JIRA Ref: https://ekoapp.atlassian.net/browse/TVW-1323

import { useState, useEffect } from 'react';
import { LoadingStatus } from '@amityco/js-sdk';

import unionBy from 'lodash/unionBy';

const noop = () => {
  if (process?.env?.NODE_ENV === 'development') console.warn('[useLiveCollection] noop hit');
};

const useLiveCollectionTemporaryIsolated = (
  uniqueKey,
  createLiveCollection,
  dependencies = [],
  resolver = () => dependencies.some((dep) => !dep),
) => {
  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState({
    hasMore: false,
    loadMore: noop,
  });

  useEffect(() => {
    if (resolver()) return;

    try {
      const liveCollection = createLiveCollection();

      // DIRECT ACCESS TO _transaction PROPERTY
      // eslint-disable-next-line no-underscore-dangle
      if (liveCollection?._transaction?.models) {
        setData(
          // eslint-disable-next-line no-underscore-dangle
          liveCollection._transaction.models.map((model) => {
            return model.modelForLiveData(liveCollection);
          }),
        );
      }

      liveCollection.on('dataUpdated', (newData) => {
        const { hasMore } = liveCollection;
        setPagination({
          hasMore,
          loadMore: hasMore ? () => liveCollection.nextPage() : noop,
        });

        setData((prevData) => {
          // Very first time dataUpdate is fired here
          // and replace existing models with just first page list
          return unionBy(newData, prevData, uniqueKey);
        });
      });

      // pagination
      liveCollection.on('loadingStatusChanged', ({ newValue }) => {
        const hasMore = newValue === LoadingStatus.Loaded && liveCollection.hasMore;

        setPagination({
          hasMore,
          loadMore: hasMore ? () => liveCollection.nextPage() : noop,
        });
      });

      if (process?.env?.NODE_ENV === 'development') {
        liveCollection.on('dataError', (error) => {
          console.warn(error);
        });
      }

      return () => liveCollection.dispose();
    } catch (err) {
      if (process?.env?.NODE_ENV === 'development')
        console.warn('[useLiveCollection] error thrown', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return [data, pagination.hasMore, pagination.loadMore];
};

export default useLiveCollectionTemporaryIsolated;
