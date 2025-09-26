import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
const SDKConnectorFetcherContext = createContext({
  fetch: async <TArgs, TResponse>({
    fetchFn,
    params,
  }: {
    fetchFn: (...args: TArgs[]) => Promise<TResponse>;
    params: TArgs[];
  }) => {
    const response = await Promise.resolve({} as TResponse);
    return response;
  },
});

export const useSDKFetcherConnector = () => useContext(SDKConnectorFetcherContext);

export default function SDKConnectorFetcherProvider({ children }: { children: React.ReactNode }) {
  const fetcherPromiseArrayMap = useRef<
    Record<
      string,
      Array<{
        resolve: (value: any) => void;
        reject: (reason?: unknown) => void;
      }>
    >
  >({});
  const fetcherResponse = useRef<Record<string, unknown>>({});

  function getFetcherKey(fnName: string, params: Array<unknown>) {
    return `${fnName}.${JSON.stringify(params)}`;
  }

  const fetch = <TArgs, TResponse>({
    fetchFn,
    params,
  }: {
    fetchFn: (...args: TArgs[]) => Promise<TResponse>;
    params: TArgs[];
  }) => {
    const key = getFetcherKey(fetchFn.name, params);

    if (fetcherPromiseArrayMap.current[key]?.length > 0) {
      if (fetcherResponse.current[key] != null) {
        return Promise.resolve(fetcherResponse.current[key] as TResponse);
      }
      let resolveFn: (value: TResponse) => void = () => {};
      let rejectFn: (reason?: unknown) => void = () => {};
      const promise = new Promise<TResponse>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
      fetcherPromiseArrayMap.current[key].push({
        resolve: resolveFn,
        reject: rejectFn,
      });

      return promise;
    }

    let resolveFn: (value: TResponse) => void = () => {};
    let rejectFn: (reason?: unknown) => void = () => {};
    const promise = new Promise<TResponse>((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });
    fetcherPromiseArrayMap.current[key] = [
      {
        resolve: resolveFn,
        reject: rejectFn,
      },
    ];

    fetchFn(...params)
      .then((response) => {
        fetcherResponse.current[key] = response;
        fetcherPromiseArrayMap.current[key].forEach(({ resolve }) => resolve(response));
      })
      .catch((error) => {
        fetcherPromiseArrayMap.current[key].forEach(({ reject }) => reject(error));
      })
      .finally(() => {
        setTimeout(() => {
          fetcherResponse.current[key] = null;
          fetcherPromiseArrayMap.current[key] = [];
        }, 500);
      });

    return promise;
  };

  return (
    <SDKConnectorFetcherContext.Provider value={{ fetch }}>
      {children}
    </SDKConnectorFetcherContext.Provider>
  );
}
