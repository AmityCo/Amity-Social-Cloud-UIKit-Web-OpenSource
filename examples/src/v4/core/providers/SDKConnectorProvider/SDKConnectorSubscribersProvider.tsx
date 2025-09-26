import { subscribeTopic } from '@amityco/ts-sdk';
import React, { createContext, useContext, useEffect, useRef } from 'react';
const SDKConnectorSubscribersContext = createContext({
  subscribe: <TParams, TCallback, TConfig>({
    topic,
    callback,
  }: {
    topic: string;
    callback: Amity.Listener;
  }) => {
    return { unsubscribe: () => {} };
  },
});

export const useSDKSubscribersConnector = () => useContext(SDKConnectorSubscribersContext);

export default function SDKConnectorSubscribersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const callbackMap = useRef<Record<string, Amity.Listener[]>>({});
  const unsubscribeFnMap = useRef<Record<string, () => void>>({});

  useEffect(() => {
    return () => {
      Object.values(unsubscribeFnMap.current).forEach((unsubscribeFn) => unsubscribeFn());
    };
  }, []);

  const subscribe = <TParams, TCallback, TConfig>({
    topic,
    callback,
  }: {
    topic: string;
    callback: Amity.Listener;
  }) => {
    if (callbackMap.current[topic]) {
      callbackMap.current[topic].push(callback);
    } else {
      callbackMap.current[topic] = [callback];

      const unsubscribeFn = subscribeTopic(topic, (...args) => {
        const callbacks = callbackMap.current[topic];
        (callbacks || []).forEach((cb) => cb(...args));
      });

      unsubscribeFnMap.current[topic] = unsubscribeFn;
    }

    return {
      unsubscribe() {
        const callbackFn = callbackMap.current[topic].find((cb) => cb === callback);
        if (callbackFn) {
          callbackMap.current[topic] = callbackMap.current[topic].filter(
            (subscriber) => subscriber !== callbackFn,
          );
        }
      },
    };
  };

  return (
    <SDKConnectorSubscribersContext.Provider value={{ subscribe }}>
      {children}
    </SDKConnectorSubscribersContext.Provider>
  );
}
