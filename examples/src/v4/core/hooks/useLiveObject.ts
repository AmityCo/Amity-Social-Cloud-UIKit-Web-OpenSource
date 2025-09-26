import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveObjectConnector } from '~/v4/core/providers/SDKConnectorProvider';
import { subscribeTopic } from '@amityco/ts-sdk';

function useLiveObject<TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback = () => {},
  options,
  shouldCall = true,
  getSubscribedTopic,
}: {
  fetcher: (
    params: TParams,
    callback: Amity.LiveObjectCallback<TCallback>,
    options?: Amity.LiveObjectOptions<TConfig>,
  ) => Amity.Unsubscriber;
  params: TParams | undefined | null;
  callback?: Amity.LiveObjectCallback<TCallback>;
  options?: Amity.LiveObjectOptions<TConfig>;
  shouldCall?: boolean;
  getSubscribedTopic?: () => string;
  refresh?: () => void;
}) {
  const { subscribe } = useSDKLiveObjectConnector();
  const [item, setItem] = useState<TCallback | null>(null);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const unsubscribeTopicRef = useRef<(() => void) | null>(null);

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
    if (getSubscribedTopic) {
      unsubscribeTopicRef.current = subscribeTopic(getSubscribedTopic());
    }

    return () => {
      unsubscribeTopicRef.current?.();
    };
  }, [getSubscribedTopic]);

  useEffect(() => {
    if (params == null) return;
    if (!shouldCall) return;

    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
      options,
    });

    return () => {
      unsubscribe();
    };
  }, [params, shouldCall]);

  const refresh = useCallback(() => {
    if (params == null) return;

    if (unsubscribeTopicRef.current) {
      unsubscribeTopicRef.current();
    }

    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
      refresh: true,
    });

    unsubscribeTopicRef.current = unsubscribe;

    return () => unsubscribe();
  }, []);

  return {
    item,
    origin,
    isLoading: isLoading || (item == null && error == null),
    error,
    refresh,
  };
}

export default useLiveObject;
