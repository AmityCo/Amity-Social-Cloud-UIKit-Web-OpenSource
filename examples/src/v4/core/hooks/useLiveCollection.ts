import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveCollectionConnector } from '~/v4/core/providers/SDKConnectorProvider';

function useLiveCollection<TCallback, TParams>({
  fetcher,
  params,
  callback = () => {},
  config,
  shouldCall = true,
}: {
  fetcher: (
    params: Amity.LiveCollectionParams<TParams>,
    callback: Amity.LiveCollectionCallback<TCallback>,
    config?: Amity.LiveCollectionConfig,
  ) => Amity.Unsubscriber;
  params: Amity.LiveCollectionParams<TParams>;
  callback?: Amity.LiveCollectionCallback<TCallback>;
  config?: Amity.LiveCollectionConfig;
  shouldCall?: boolean;
}): {
  items: TCallback[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
  loadMoreHasBeenCalled: boolean;
  refresh: () => void;
} {
  const { subscribe } = useSDKLiveCollectionConnector();
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const [isLoading, setIsLoading] = useState(shouldCall ? shouldCall : true);
  const [items, setItems] = useState<TCallback[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const loadMoreFnRef = useRef<(() => void) | null>(null);
  const unsubscribeRef = useRef<Amity.Unsubscriber | null>(null);

  const loadMore = useCallback(() => {
    if (loadMoreFnRef.current) {
      setLoadMoreHasBeenCalled(true);
      loadMoreFnRef.current?.();
    }
  }, [loadMoreFnRef, loadMoreHasBeenCalled, isLoading, setIsLoading]);

  const callbackFn = useCallback(
    (response) => {
      if (!shouldCall) return;
      if (response.data) setItems(response.data);
      setIsLoading(response.loading);
      setHasMore(response.hasNextPage);
      setError(response.error);
      loadMoreFnRef.current = response.onNextPage;
      callback(response);
    },
    [shouldCall, loadMoreFnRef],
  );

  useEffect(() => {
    if (!shouldCall) return;
    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
    });
    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [params, shouldCall]);

  const refresh = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
      refresh: true,
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, []);

  return {
    items,
    hasMore,
    isLoading,
    loadMore,
    error,
    loadMoreHasBeenCalled,
    refresh,
  };
}

export default useLiveCollection;
