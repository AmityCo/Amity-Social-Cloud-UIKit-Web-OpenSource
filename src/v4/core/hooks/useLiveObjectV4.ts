import { useCallback, useEffect, useRef, useState } from 'react';

function useLiveObjectV4<TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback = () => {},
  options,
  shouldCall = true,
}: {
  fetcher: (
    params: TParams,
    callback: Amity.LiveObjectCallback<TCallback>,
    options?: Amity.LiveObjectOptions<TConfig>,
  ) => Amity.Unsubscriber;
  params: TParams;
  callback?: Amity.LiveObjectCallback<TCallback>;
  options?: Amity.LiveObjectOptions<TConfig>;
  shouldCall?: boolean;
}) {
  const [item, setItem] = useState<TCallback | null>(null);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Amity.Unsubscriber | null>(null);

  const callbackFn: Amity.LiveObjectCallback<TCallback> = useCallback(
    (response) => {
      if (!shouldCall) return;
      if (params == null) return;
      setIsLoading(response.loading);
      if (response.data) setItem(response.data);
      setOrigin(response.origin);
      setError(response.error);
      callback(response);
    },
    [shouldCall, callback],
  );

  useEffect(() => {
    if (!shouldCall) return;

    const { unsubscribe } = subscribe({ fetcher, params, callback: callbackFn, options });

    return () => unsubscribe();
  }, [JSON.stringify(params), shouldCall]);

  const refresh = useCallback(() => {
    if (unsubscribeRef.current) unsubscribeRef.current();

    const { unsubscribe } = subscribe({ fetcher, params, callback: callbackFn, options });

    unsubscribeRef.current = unsubscribe;

    return () => unsubscribe();
  }, []);

  return {
    item,
    origin,
    isLoading,
    error,
    refresh,
  };
}

export default useLiveObjectV4;

const subscribe = <TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback,
  options,
}: {
  fetcher: (
    params: TParams,
    callback: Amity.LiveObjectCallback<TCallback>,
    options?: Amity.LiveObjectOptions<TConfig>,
  ) => Amity.Unsubscriber;
  params: TParams;
  callback: Amity.LiveObjectCallback<TCallback>;
  options?: Amity.LiveObjectOptions<TConfig>;
}) => {
  const unsubscribe = fetcher(params, (response) => callback(response), options);
  return { unsubscribe };
};
