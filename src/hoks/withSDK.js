import React, { useContext, useMemo } from 'react';

export const SDKContext = React.createContext({});

export const SDKProvider = SDKContext.Provider;

const withSDK = Component => props => {
  const { client, SDK } = useContext(SDKContext);

  return <Component client={client} SDK={SDK} {...props} />;
};

export default withSDK;
