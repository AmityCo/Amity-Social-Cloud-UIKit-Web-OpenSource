import React, { PropsWithChildren, createContext, useContext, useMemo } from 'react';

const defaultConfig = {
  socialCommunityCreationButtonVisible: true,
};

const ConfigContext = createContext(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

type ConfigProviderProps = PropsWithChildren<{
  config: typeof defaultConfig;
}>;

export default function ConfigProvider({ children, config }: ConfigProviderProps) {
  const value = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
