import React, { createContext, useContext, useMemo } from 'react';
import { stripUndefinedValues } from '~/helpers/utils';

export type SocialConfiguration = {
  socialCommunityCreationButtonVisible?: boolean;
  showCreatePublicCommunityOption?: boolean;
  showUserProfileMetadata?: boolean;
};

const defaultConfig = {
  socialCommunityCreationButtonVisible: true,
  showCreatePublicCommunityOption: false,
  showUserProfileMetadata: false,
};

const ConfigContext = createContext(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export default ({ children, config }) => {
  const value = useMemo(() => ({ ...defaultConfig, ...stripUndefinedValues(config) }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
