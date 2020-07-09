import React, { useContext, useMemo } from 'react';

export const SdkContext = React.createContext({});

export const SdkProvider = SdkContext.Provider;

const withSdk = Component => props => {
  const { client, sdk } = useContext(SdkContext);

  return <Component client={client} sdk={sdk} {...props} />;
};

export default withSdk;
