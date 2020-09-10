import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import { Helmet } from 'react-helmet';
import EkoClient, { _changeSDKDefaultConfig } from 'eko-sdk';

import { ThemeProvider } from 'styled-components';
import { CustomComponentsProvider } from 'hocs/customization';
import { SDKProvider } from 'hocs/withSDK';
import MockData from 'mock';
import { ConfirmContainer } from 'components/Confirm';
import { NotificationsContainer } from 'components/Notification';
import Localization from './Localisation';
import { UIStyles } from './styles';
import GlobalTheme from './GlobalTheme';

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
    <>
      <Helmet>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <Localization>
        <ThemeProvider theme={merge(GlobalTheme, theme)}>
          <UIStyles>
            <SDKProvider value={SDKInfo}>
              <CustomComponentsProvider value={customComponents}>
                <MockData>{children}</MockData>
                <NotificationsContainer />
                <ConfirmContainer />
              </CustomComponentsProvider>
            </SDKProvider>
          </UIStyles>
        </ThemeProvider>
      </Localization>
    </>
  );
};

export default UiKitProvider;
