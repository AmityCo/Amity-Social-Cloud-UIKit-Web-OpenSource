import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveCollectionConnector } from '~/v4/core/providers/SDKConnectorProvider';
import { useSdkFnEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

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

  // The caller's own condition, and then the module's. A component that early
  // returns on `isExcluded` has already run this hook by the time it does, so
  // without this the request goes out for a module the customer switched off.
  const moduleOn = useSdkFnEnabled(fetcher);
  const enabled = shouldCall && moduleOn;

  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  // A disabled module will never answer, so it is not loading — reporting true
  // would leave every skeleton above it spinning for the life of the session.
  const [isLoading, setIsLoading] = useState(moduleOn ? (shouldCall ? shouldCall : true) : false);
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
      if (!enabled) return;
      if (response.data) setItems(response.data);
      setIsLoading(response.loading);
      setHasMore(response.hasNextPage);
      setError(response.error);
      loadMoreFnRef.current = response.onNextPage;
      callback(response);
    },
    [enabled, loadMoreFnRef],
  );

  // Keep refs up to date so refresh() always uses the latest values
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const subscribeRef = useRef(subscribe);
  subscribeRef.current = subscribe;
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const callbackFnRef = useRef(callbackFn);
  callbackFnRef.current = callbackFn;

  useEffect(() => {
    if (!enabled) return;
    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [JSON.stringify(params), enabled]);

  const refresh = useCallback(() => {
    // refresh() subscribes directly rather than through the effect, so it needs
    // the same gate — otherwise a pull-to-refresh reaches a disabled module.
    if (!enabledRef.current) return () => {};

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const { unsubscribe } = subscribeRef.current({
      fetcher: fetcherRef.current,
      params: paramsRef.current,
      callback: callbackFnRef.current,
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
