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
      // Dispose the SDK collection being replaced, or it keeps feeding the
      // subscribers of the one created below.
      unsubscribeFnMap.current[key]?.();
      delete unsubscribeFnMap.current[key];
      delete responseMap.current[key];
      delete subscriberMap.current[key];
    }

    // A subscription whose first response has not arrived yet is still a
    // subscription: join it rather than opening a second SDK collection for
    // the same key (which would orphan the first and notify everyone twice).
    // This is what a component that unmounts and remounts at once hits, for
    // example under React strict mode.
    if (subscriberMap.current[key]) {
      const cached = responseMap.current[key];
      if (cached) callback?.(cached as Amity.LiveCollection<TCallback>);
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
        // Only this subscriber leaves. The SDK collection stays alive for the
        // next mount with the same key, so a page that comes back replays the
        // rows it already had instead of fetching the first page again.
        const subscribers = subscriberMap.current[key];
        if (!subscribers) return;
        subscriberMap.current[key] = subscribers.filter((subscriber) => subscriber !== callback);
      },
    };
  };

  return (
    <SDKConnectorLiveCollectionContext.Provider value={{ subscribe }}>
      {children}
    </SDKConnectorLiveCollectionContext.Provider>
  );
}
