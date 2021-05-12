import React, { createContext, useContext } from 'react';
import { stripUndefinedValues } from '~/helpers/utils';

const defaultConfig = {
  socialCommunityCreationButtonVisible: true,
};

const ConfigContext = createContext(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export default ({ children, config }) => {
  return (
    <ConfigContext.Provider value={{ ...defaultConfig, ...stripUndefinedValues(config) }}>
      {children}
    </ConfigContext.Provider>
  );
};
