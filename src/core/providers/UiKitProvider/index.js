import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import EkoClient, { _changeSDKDefaultConfig } from 'eko-sdk';

import { ThemeProvider } from 'styled-components';
import { NotificationsContainer } from '~/core/components/Notification';
import { ConfirmContainer } from '~/core/components/Confirm';
import { CustomComponentsProvider } from '~/core/hocs/customization';
import { SDKProvider } from '~/core/hocs/withSDK';
import MockData from '~/mock';
import Localization from './Localisation';
import buildGlobalTheme from './theme';
import { UIStyles } from './styles';

let client;

const UiKitProvider = ({
  apiKey,
  userId,
  displayName,
  customComponents = {},
  theme = {},
  children /* TODO localization */,
}) => {
  const SDKInfo = useMemo(() => {
    _changeSDKDefaultConfig({
      /* eslint-disable-next-line no-undef */
      ws: { endpoint: __API_ENDPOINT__ },
      /* eslint-disable-next-line no-undef */
      http: { endpoint: __API_ENDPOINT__ },
    });

    if (!client) client = new EkoClient({ apiKey });
    else client.unregisterSession();

    client.registerSession({
      userId,
      displayName,
    });

    return { client };
  }, [apiKey, userId, displayName]);

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <Localization>
        <ThemeProvider theme={buildGlobalTheme(theme)}>
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

UiKitProvider.propTypes = {
  apiKey: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  customComponents: PropTypes.object,
  theme: PropTypes.shape({
    palette: PropTypes.object,
    typography: PropTypes.object,
  }),
  children: PropTypes.node,
};

export default UiKitProvider;
