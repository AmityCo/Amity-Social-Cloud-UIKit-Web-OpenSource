import React, { useContext, useMemo } from 'react';
import { merge } from 'lodash';
import EkoClient, { _changeSDKDefaultConfig } from 'eko-sdk';

import { ThemeProvider } from 'styled-components';
import { CustomComponentsContext, CustomComponentsProvider } from '../hoks/customization';
import { SDKProvider } from '../hoks/withSDK';
import Localization from './Localisation';
import GlobalStyle from './GlobalStyle';
import GlobalTheme from './GlobalTheme';
import MockData from '../mock/';
import { ConfirmContainer } from '../commonComponents/Confirm';
import { NotificationsContainer } from '../commonComponents/Notification';

_changeSDKDefaultConfig({
  ws: { endpoint: 'https://api.staging.ekomedia.technology' },
  http: { endpoint: 'https://api.staging.ekomedia.technology' },
});

let client;

const UiKitProvider = ({
  customComponents = {},
  theme = {},
  clientOptions,
  children /* TODO localization */,
}) => {
  const customComponentsMap = useContext(CustomComponentsContext);

  const memoizedCustomComponentsMap = useMemo(
    () => ({
      ...customComponentsMap,
      ...customComponents,
    }),
    [customComponentsMap, customComponents],
  );

  const SDKInfo = useMemo(
    () => {
      // TODO fix
      // initialize only one client
      if (!client) {
        client = new EkoClient(clientOptions);
        // Register Session with EkoClient with userId and display name
        client.registerSession({
          userId: 'Web-Test',
          displayName: 'Web-Test',
        });
      }

      return {
        client,
      };
    },
    [clientOptions],
  );

  return (
    <Localization>
      <ThemeProvider theme={merge(GlobalTheme, theme)}>
        <SDKProvider value={SDKInfo}>
          <CustomComponentsProvider value={customComponents}>
            <GlobalStyle />
            <MockData>{children}</MockData>
            <NotificationsContainer />
            <ConfirmContainer />
          </CustomComponentsProvider>
        </SDKProvider>
      </ThemeProvider>
    </Localization>
  );
};

export default UiKitProvider;
