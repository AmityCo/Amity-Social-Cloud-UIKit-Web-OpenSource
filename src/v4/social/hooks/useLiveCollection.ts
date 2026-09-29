import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveCollectionConnector } from '~/v4/core/providers/SDKConnectorProvider';
import { useSdkFnEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

function useLiveCollection<TCallback, TParams>({
  fetcher,
  params,
  callback = () => {},
  config,
  shouldCall = () => true,
}: {
  fetcher: (
    params: Amity.LiveCollectionParams<TParams>,
    callback: Amity.LiveCollectionCallback<TCallback>,
    config?: Amity.LiveCollectionConfig,
  ) => Amity.Unsubscriber;
  params: Amity.LiveCollectionParams<TParams>;
  callback?: Amity.LiveCollectionCallback<TCallback>;
  config?: Amity.LiveCollectionConfig;
  shouldCall?: () => boolean;
}): {
  items: TCallback[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
  loadMoreHasBeenCalled: boolean;
} {
  const { subscribe } = useSDKLiveCollectionConnector();

  // The caller's own condition, and then the module's. `shouldCall` is a thunk
  // in this variant, so the two are combined into one thunk. See
  // v4/core/hooks/useLiveCollection.
  const moduleOn = useSdkFnEnabled(fetcher);
  const enabled = useCallback(() => moduleOn && shouldCall(), [moduleOn, shouldCall]);

  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  // A disabled module will never answer, so it is not loading.
  const [isLoading, setIsLoading] = useState(moduleOn ? (shouldCall ? shouldCall() : true) : false);
  const [items, setItems] = useState<TCallback[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const loadMoreFnRef = useRef<(() => void) | null>(null);

  const loadMore = useCallback(() => {
    if (loadMoreFnRef.current) {
      setLoadMoreHasBeenCalled(true);
      loadMoreFnRef.current?.();
    }
  }, [loadMoreFnRef, loadMoreHasBeenCalled, isLoading, setIsLoading]);

  const callbackFn = useCallback(
    (response) => {
      if (!enabled()) return;
      if (response.data) setItems(response.data);
      setIsLoading(response.loading);
      setHasMore(response.hasNextPage);
      setError(response.error);
      loadMoreFnRef.current = response.onNextPage;
      callback(response);
    },
    [enabled, setItems, setIsLoading, setHasMore, loadMoreFnRef, callback],
  );

  useEffect(() => {
    if (!enabled()) return;
    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
    });

    return () => {
      unsubscribe();
    };
  }, [params, enabled]);

  return {
    items,
    hasMore,
    isLoading,
    loadMore,
    error,
    loadMoreHasBeenCalled,
  };
}

export default useLiveCollection;
