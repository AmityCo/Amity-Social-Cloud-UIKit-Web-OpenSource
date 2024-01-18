import React, { ReactNode } from 'react';
import SDKConnectorLiveCollectionProvider from './SDKConnectorLiveCollectionProvider';
import SDKConnectorLiveObjectProvider from './SDKConnectorLiveObjectProvider';
import SDKConnectorFetcherProvider from './SDKConnectorFetcherProvider';
import SDKConnectorSubscribersProvider from './SDKConnectorSubscribersProvider';

export { useSDKLiveCollectionConnector } from './SDKConnectorLiveCollectionProvider';
export { useSDKLiveObjectConnector } from './SDKConnectorLiveObjectProvider';
export { useSDKFetcherConnector } from './SDKConnectorFetcherProvider';

export default function SDKConnectorProvider({ children }: { children: ReactNode }) {
  return (
    <SDKConnectorLiveCollectionProvider>
      <SDKConnectorLiveObjectProvider>
        <SDKConnectorSubscribersProvider>
          <SDKConnectorFetcherProvider>{children}</SDKConnectorFetcherProvider>
        </SDKConnectorSubscribersProvider>
      </SDKConnectorLiveObjectProvider>
    </SDKConnectorLiveCollectionProvider>
  );
}
