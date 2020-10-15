import React, { useContext } from 'react';

export const SDKContext = React.createContext({});

export const SDKProvider = SDKContext.Provider;

const withSDK = Component => props => {
  const { client } = useContext(SDKContext);
  const userRoles = client?.currentUser?.model?.roles;

  return <Component client={client} userRoles={userRoles} {...props} />;
};

export default withSDK;
