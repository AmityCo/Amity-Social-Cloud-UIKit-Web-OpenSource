import { ConnectionStatus } from '@amityco/js-sdk';
import React, { useContext, useEffect, useMemo, useState } from 'react';

const SDKContext = React.createContext({});

export const useSDK = () => useContext(SDKContext);

export const SDKProvider = ({ children, client }) => {
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.NotConnected);

  useEffect(() => {
    if (client) {
      setConnectionStatus(client.connectionStatus);

      client.on('connectionStatusChanged', ({ newValue }) => setConnectionStatus(newValue));
    }
  }, [client]);

  const value = useMemo(
    () => ({
      client,
      connected: connectionStatus === ConnectionStatus.Connected,
      currentUserId: client?.currentUser?.model?.userId,
      userRoles: client?.currentUser?.model?.roles,
      networkSettings: client?.networkSettings ?? {},
    }),
    [
      client,
      connectionStatus,
      client?.currentUser?.model?.userId,
      client?.currentUser?.model?.roles,
      client?.networkSettings,
    ],
  );

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};

const withSDK = (Component) => (props) => {
  const sdkData = useSDK();

  return <Component {...sdkData} {...props} />;
};

export default withSDK;
