/* eslint-disable no-underscore-dangle */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import EkoClient from 'eko-sdk';

import { ThemeProvider } from 'styled-components';
import { NotificationsContainer } from '~/core/components/Notification';
import { ConfirmContainer } from '~/core/components/Confirm';
import { CustomComponentsProvider } from '~/core/hocs/customization';
import { SDKProvider } from '~/core/hocs/withSDK';
import MockData from '~/mock';
import Localisation from './Localisation';
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
  const theGlobal = /* globalThis || */ window || global;

  theGlobal.__upstra__ = {
    ...theGlobal.__upstra__,
    uikit: __VERSION__,
  };

  const SDKInfo = useMemo(() => {
    if (!client) client = new EkoClient({ apiKey });
    else if (client.currentUserId !== userId) client.unregisterSession();

    if (!client.currentUserId) {
      client.registerSession({
        userId,
        displayName,
      });
    }

    return { client };
  }, [apiKey, userId, displayName]);

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <Localisation locale="en">
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
      </Localisation>
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
