import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
const SDKConnectorLiveCollectionContext = createContext({
  subscribe: <TParams, TCallback>({
    fetcher,
    params,
    callback,
    config,
    refresh = false,
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
    return { unsubscribe: () => {} };
  },
});

export const useSDKLiveCollectionConnector = () => useContext(SDKConnectorLiveCollectionContext);

export default function SDKConnectorLiveCollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscriberMap = useRef<Record<string, Array<Amity.LiveCollectionCallback<unknown>>>>({});
  const unsubscribeFnMap = useRef<Record<string, () => void>>({});
  const responseMap = useRef<Record<string, Amity.LiveCollection<unknown>>>({});
  const { currentUserId } = useSDK();

  function getSubscriberKey<TParams>(fnName: string, params: Amity.LiveCollectionParams<TParams>) {
    return `${currentUserId}.${fnName}.${JSON.stringify(params)}`;
  }

  useEffect(() => {
    return () => {
      Object.values(unsubscribeFnMap.current).forEach((unsubscribeFn) => unsubscribeFn());
    };
  }, []);

  const subscribe = <TParams, TCallback>({
    fetcher,
    params,
    callback,
    config,
    refresh = false,
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
    if (currentUserId == null) return { unsubscribe() {} };
    const key = getSubscriberKey(fetcher.name, params);

    if (refresh) {
      delete responseMap.current[key];
      delete subscriberMap.current[key];
    }

    if (subscriberMap.current[key] && responseMap.current[key]) {
      callback?.(responseMap.current[key] as Amity.LiveCollection<TCallback>);
      subscriberMap.current[key].push(callback as Amity.LiveCollectionCallback<unknown>);
    } else {
      subscriberMap.current[key] = [callback as Amity.LiveCollectionCallback<unknown>];

      const unsubscribeFn = fetcher(
        params,
        (response) => {
          responseMap.current[key] = response;
          const subscribers = subscriberMap.current[key];
          (subscribers || []).forEach((subscriber) => subscriber(response));
        },
        config,
      );

      unsubscribeFnMap.current[key] = unsubscribeFn;
    }

    return {
      unsubscribe() {
        const callbackFn = subscriberMap.current[key].find((subscriber) => subscriber === callback);
        if (callbackFn) {
          subscriberMap.current[key] = subscriberMap.current[key].filter(
            (subscriber) => subscriber !== callbackFn,
          );
        }
      },
    };
  };

  return (
    <SDKConnectorLiveCollectionContext.Provider value={{ subscribe }}>
      {children}
    </SDKConnectorLiveCollectionContext.Provider>
  );
}
