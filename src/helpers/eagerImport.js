import { lazy } from 'react';

export const eagerImportDefault = (factory) => {
  const importPromise = factory();
  return lazy(() => importPromise);
};

export const eagerImport = (factory) => {
  const promise = factory();
  return new Proxy(
    {},
    {
      get: (_target, componentName) => {
        return lazy(() =>
          promise.then((x) => ({
            default: x[componentName],
          })),
        );
      },
    },
  );
};
