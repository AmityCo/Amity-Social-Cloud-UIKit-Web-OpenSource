import { ConnectionStatus } from '@amityco/js-sdk';
import React, { useContext, useEffect, useState } from 'react';

const SDKContext = React.createContext({});

export const useSDK = () => useContext(SDKContext);

export function SDKProvider({ children, client }) {
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.NotConnected);

  useEffect(() => {
    if (client) {
      setConnectionStatus(client.connectionStatus);

      client.on('connectionStatusChanged', ({ newValue }) => setConnectionStatus(newValue));
    }
  }, [client]);

  return (
    <SDKContext.Provider
      value={{
        client,
        connected: connectionStatus === ConnectionStatus.Connected,
        currentUserId: client?.currentUserId,
        userRoles: client?.currentUser?.model?.roles,
        networkSettings: client?.networkSettings ?? {},
      }}
    >
      {children}
    </SDKContext.Provider>
  );
}

const withSDK = Component => props => {
  const sdkData = useSDK();

  return <Component {...sdkData} {...props} />;
};

export default withSDK;
