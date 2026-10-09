import { useCallback, useEffect, useRef, useState } from 'react';
import { useSdkFnEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

function useLiveObjectV4<TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback = () => {},
  options,
  shouldCall = true,
  calledOnce = false,
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
  calledOnce?: boolean;
}) {
  // The caller's own condition, and then the module's. See useLiveCollection.
  const moduleOn = useSdkFnEnabled(fetcher);
  const enabled = shouldCall && moduleOn;

  const [item, setItem] = useState<TCallback | null>(null);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Amity.Unsubscriber | null>(null);
  // refresh() is memoised with an empty dep list, so it reads the gate off a ref.
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const callbackFn: Amity.LiveObjectCallback<TCallback> = useCallback(
    (response) => {
      if (!enabled) return;
      if (params == null) return;
      setIsLoading(response.loading);
      if (response.error) setItem(null);
      else if (response.data) setItem(response.data);
      setOrigin(response.origin);
      setError(response.error);
      callback(response);
    },
    [enabled, callback],
  );

  useEffect(() => {
    if (!enabled) return;

    const { unsubscribe } = subscribe({ fetcher, params, callback: callbackFn, options });

    if (calledOnce) unsubscribe();

    return () => unsubscribe();
  }, [JSON.stringify(params), enabled, calledOnce]);

  const refresh = useCallback(() => {
    // Subscribes directly rather than through the effect, so it needs the gate too.
    if (!enabledRef.current) return () => {};

    if (unsubscribeRef.current) unsubscribeRef.current();

    const { unsubscribe } = subscribe({ fetcher, params, callback: callbackFn, options });

    if (calledOnce) unsubscribe();

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
