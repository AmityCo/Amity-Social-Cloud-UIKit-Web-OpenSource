import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * This hook is used to manage live collections without having cache in UIKit level.
 * It provides same functionalities of useLiveCollection.
 */

export function useLiveCollectionV4<TCallback, TParams>({
  fetcher,
  params,
  callback = () => {},
  shouldCall = true,
}: {
  fetcher: (
    params: Amity.LiveCollectionParams<TParams>,
    callback: Amity.LiveCollectionCallback<TCallback>,
    config?: Amity.LiveCollectionConfig,
  ) => Amity.Unsubscriber;
  params: Amity.LiveCollectionParams<TParams>;
  callback?: Amity.LiveCollectionCallback<TCallback>;
  shouldCall?: boolean;
}): {
  items: TCallback[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
  loadMoreHasBeenCalled: boolean;
  refresh: () => void;
  isLoadingFirstPage: boolean;
} {
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const loadingCountRef = useRef(0);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [loadMoreFnRef]);

  const callbackFn = useCallback(
    (response) => {
      if (!shouldCall) return;
      if (response.data) setItems(response.data);
      if (loadingCountRef.current === 0) {
        setIsLoadingFirstPage(response.loading);
      } else {
        setIsLoadingFirstPage(false);
        setIsLoading(response.loading);
      }
      loadingCountRef.current += 1;
      setHasMore(response.hasNextPage);
      setError(response.error);
      loadMoreFnRef.current = response.onNextPage;
      callback(response);
    },
    [shouldCall],
  );

  useEffect(() => {
    if (!shouldCall) return;
    const { unsubscribe } = subscribe({ fetcher, params, callback: callbackFn });
    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, [JSON.stringify(params), shouldCall]);

  const refresh = useCallback(() => {
    if (unsubscribeRef.current) unsubscribeRef.current();

    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
    });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, []);

  return {
    error,
    items,
    hasMore,
    isLoading,
    loadMore,
    refresh,
    isLoadingFirstPage,
    loadMoreHasBeenCalled,
  };
}

const subscribe = <TParams, TCallback>({
  fetcher,
  params,
  callback,
  config,
}: {
  fetcher: (
    params: Amity.LiveCollectionParams<TParams>,
    callback: Amity.LiveCollectionCallback<TCallback>,
    config?: Amity.LiveCollectionConfig,
  ) => Amity.Unsubscriber;
  params: Amity.LiveCollectionParams<TParams>;
  callback: Amity.LiveCollectionCallback<TCallback>;
  config?: Amity.LiveCollectionConfig;
  refresh?: boolean;
}) => {
  const unsubscribe = fetcher(params, (response) => callback(response), config);
  return { unsubscribe };
};
