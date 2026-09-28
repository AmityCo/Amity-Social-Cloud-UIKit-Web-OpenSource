import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveObjectConnector } from '~/v4/core/providers/SDKConnectorProvider';
import { subscribeTopic } from '@amityco/ts-sdk';
import { useSdkFnEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

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

  // The caller's own condition, and then the module's. See useLiveCollection.
  const moduleOn = useSdkFnEnabled(fetcher);
  const enabled = shouldCall && moduleOn;

  const [item, setItem] = useState<TCallback | null>(null);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const unsubscribeTopicRef = useRef<(() => void) | null>(null);
  // refresh() is memoised with an empty dep list, so it reads the gate off a ref.
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const callbackFn: Amity.LiveObjectCallback<TCallback> = useCallback(
    (response) => {
      if (!enabled) return;
      if (params == null) return;
      setIsLoading(response.loading);
      if (response.data) setItem(response.data);
      setOrigin(response.origin);
      setError(response.error);
      callback(response);
    },
    [enabled, callback],
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
    if (!enabled) return;

    const { unsubscribe } = subscribe({
      fetcher,
      params,
      callback: callbackFn,
      options,
    });

    return () => {
      unsubscribe();
    };
  }, [params, enabled]);

  const refresh = useCallback(() => {
    if (params == null) return;
    // Subscribes directly rather than through the effect, so it needs the gate too.
    if (!enabledRef.current) return;

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
    // A disabled module answers with neither data nor error, which this
    // expression would report as loading for the life of the session.
    isLoading: moduleOn && (isLoading || (item == null && error == null)),
    error,
    refresh,
  };
}

export default useLiveObject;
