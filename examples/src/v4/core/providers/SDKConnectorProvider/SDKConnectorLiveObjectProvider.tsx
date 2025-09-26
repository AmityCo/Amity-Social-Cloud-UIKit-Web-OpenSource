import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
const SDKConnectorLiveObjectContext = createContext({
  subscribe: <TParams, TCallback, TConfig>({
    fetcher,
    params,
    callback = () => {},
    options,
    refresh = false,
  }: {
    fetcher: (
      params: TParams,
      callback: Amity.LiveObjectCallback<TCallback>,
      options?: Amity.LiveObjectOptions<TConfig>,
    ) => Amity.Unsubscriber;
    params: TParams;
    callback?: Amity.LiveObjectCallback<TCallback>;
    options?: Amity.LiveObjectOptions<TConfig>;
    refresh?: boolean;
  }) => {
    return { unsubscribe: () => {} };
  },
});

export const useSDKLiveObjectConnector = () => useContext(SDKConnectorLiveObjectContext);

export default function SDKConnectorLiveObjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscriberMap = useRef<Record<string, Array<Amity.LiveObjectCallback<unknown>>>>({});
  const unsubscribeFnMap = useRef<Record<string, () => void>>({});
  const responseMap = useRef<Record<string, Amity.LiveObject<unknown>>>({});
  const { currentUserId } = useSDK();

  function getSubscriberKey<TParams>(fnName: string, params: TParams) {
    return `${currentUserId}.${fnName}.${JSON.stringify(params)}`;
  }

  useEffect(() => {
    return () => {
      Object.values(unsubscribeFnMap.current).forEach((unsubscribeFn) => unsubscribeFn());
    };
  }, []);

  const subscribe = <TParams, TCallback, TConfig>({
    fetcher,
    params,
    callback = () => {},
    options,
    refresh = false,
  }: {
    fetcher: (
      params: TParams,
      callback: Amity.LiveObjectCallback<TCallback>,
      options?: Amity.LiveObjectOptions<TConfig>,
    ) => Amity.Unsubscriber;
    params: TParams;
    callback?: Amity.LiveObjectCallback<TCallback>;
    options?: Amity.LiveObjectOptions<TConfig>;
    refresh?: boolean;
  }) => {
    if (currentUserId == null) return { unsubscribe() {} };
    const key = getSubscriberKey(fetcher.name, params);

    if (refresh) {
      delete responseMap.current[key];
      delete subscriberMap.current[key];
    }

    if (subscriberMap.current[key]) {
      callback(responseMap.current[key] as Amity.LiveObject<TCallback>);
      subscriberMap.current[key].push(callback as Amity.LiveObjectCallback<unknown>);
    } else {
      subscriberMap.current[key] = [callback as Amity.LiveObjectCallback<unknown>];

      const unsubscribeFn = fetcher(
        params,
        (response) => {
          responseMap.current[key] = response;
          const subscribers = subscriberMap.current[key];
          (subscribers || []).forEach((subscriber) => subscriber(response));
        },
        options,
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
    <SDKConnectorLiveObjectContext.Provider value={{ subscribe }}>
      {children}
    </SDKConnectorLiveObjectContext.Provider>
  );
}
