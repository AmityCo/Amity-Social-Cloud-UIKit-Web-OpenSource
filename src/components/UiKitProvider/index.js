import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import EkoClient, { _changeSDKDefaultConfig } from 'eko-sdk';

import { ThemeProvider } from 'styled-components';
import { CustomComponentsProvider } from '../../hocs/customization';
import { SDKProvider } from '../../hocs/withSDK';
import Localization from './Localisation';
import GlobalStyle from './GlobalStyle';
import { UIStyles } from './styles';
import GlobalTheme from './GlobalTheme';
import MockData from '../../mock';
import { ConfirmContainer } from '../Confirm';
import { NotificationsContainer } from '../Notification';

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
  const SDKInfo = useMemo(() => {
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
  }, [clientOptions]);

  return (
    <Localization>
      <ThemeProvider theme={merge(GlobalTheme, theme)}>
        <UIStyles>
          <SDKProvider value={SDKInfo}>
            <CustomComponentsProvider value={customComponents}>
              <GlobalStyle />
              <MockData>{children}</MockData>
              <NotificationsContainer />
              <ConfirmContainer />
            </CustomComponentsProvider>
          </SDKProvider>
        </UIStyles>
      </ThemeProvider>
    </Localization>
  );
};

export default UiKitProvider;
