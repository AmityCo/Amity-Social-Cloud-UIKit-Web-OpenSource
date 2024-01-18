import { useCallback, useEffect, useRef, useState } from 'react';
import { useSDKLiveObjectConnector } from '../providers/SDKConnectorProvider';
import { subscribeTopic } from '@amityco/ts-sdk';

function useLiveObject<TParams, TCallback, TConfig>({
  fetcher,
  params,
  callback = () => {},
  options,
  shouldCall = () => true,
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
  shouldCall?: () => boolean;
  getSubscribedTopic?: () => string;
}) {
  const { subscribe } = useSDKLiveObjectConnector();
  const [item, setItem] = useState<TCallback | null>(null);
  const unsubscribeTopicRef = useRef<(() => void) | null>(null);

  const callbackFn: Amity.LiveObjectCallback<TCallback> = useCallback(
    (response) => {
      if (shouldCall && !shouldCall()) return;
      if (params == null) return;
      if (response.data) setItem(response.data);
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
    if (shouldCall && !shouldCall()) return;

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

  return item;
}

export default useLiveObject;

// // TODO add errors handling
// import { useState, useEffect } from 'react';
// import { useSDK } from '~/core/hooks/useSDK';

// const useLiveObject = (
//   createLiveObject,
//   dependencies = [],
//   resolver = () => dependencies.some((dep) => !dep),
// ) => {
//   const { connected } = useSDK();
//   const [data, setData] = useState({});

//   useEffect(() => {
//     if (resolver()) return;

//     const liveObject = createLiveObject();
//     liveObject.model && setData(liveObject.model);
//     liveObject.on('dataUpdated', setData);

//     return () => liveObject.dispose();
//
//   }, [connected, ...dependencies]);

//   return data;
// };

// export default useLiveObject;
