import { useEffect, useRef } from 'react';
import useLiveObject from '~/v4/core/hooks/useLiveObject';
import { useSDKSubscribersConnector } from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorSubscribersProvider';

export default function useSubscription<TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback = () => {},
  options,
  shouldSubscribe = true,
  getSubscribedTopic,
}: {
  fetcher: (
    params: TParams,
    callback: Amity.LiveObjectCallback<TCallback>,
    options?: Amity.LiveObjectOptions<TConfig>,
  ) => Amity.Unsubscriber;
  params: TParams | undefined | null;
  callback?: Amity.Listener;
  options?: Amity.LiveObjectOptions<TConfig>;
  shouldSubscribe?: boolean;
  getSubscribedTopic: (response: Amity.LiveObject<TCallback>) => string;
}) {
  const { subscribe } = useSDKSubscribersConnector();
  const unsubscribeTopicRef = useRef<(() => void) | null>(null);
  useLiveObject({
    fetcher,
    params,
    callback: (response) => {
      const { error, loading } = response;
      if (loading) return;
      if (error) throw error;
      const { unsubscribe } = subscribe({ topic: getSubscribedTopic(response), callback });
      unsubscribeTopicRef.current = unsubscribe;
    },
    options,
    shouldCall: shouldSubscribe,
  });

  useEffect(() => {
    return () => {
      unsubscribeTopicRef.current?.();
    };
  }, [unsubscribeTopicRef]);

  return {
    unsubscribe: () => unsubscribeTopicRef.current?.(),
  };
}
