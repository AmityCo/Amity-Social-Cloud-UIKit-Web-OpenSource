import React, { ReactNode } from 'react';
import SDKConnectorLiveCollectionProvider from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorLiveCollectionProvider';
import SDKConnectorLiveObjectProvider from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorLiveObjectProvider';
import SDKConnectorFetcherProvider from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorFetcherProvider';
import SDKConnectorSubscribersProvider from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorSubscribersProvider';

export { useSDKLiveCollectionConnector } from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorLiveCollectionProvider';
export { useSDKLiveObjectConnector } from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorLiveObjectProvider';
export { useSDKFetcherConnector } from '~/v4/core/providers/SDKConnectorProvider/SDKConnectorFetcherProvider';

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
