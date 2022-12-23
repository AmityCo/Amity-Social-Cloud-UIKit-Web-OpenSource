import React, { createContext, useContext, useMemo, PropsWithChildren } from 'react';
import { stripUndefinedValues } from '~/helpers/utils';

export type DataFetchingHandlers = {
  getUserMetadata?: (userAccessCode: string) => Promise<{ data: Record<string, unknown> }>;
};

const ConfigContext = createContext<DataFetchingHandlers>({});

export const useAsyncData = () => useContext(ConfigContext);

export default ({ children, handlers }: PropsWithChildren<{ handlers: DataFetchingHandlers }>) => {
  const value: DataFetchingHandlers = useMemo(() => stripUndefinedValues(handlers), [handlers]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
