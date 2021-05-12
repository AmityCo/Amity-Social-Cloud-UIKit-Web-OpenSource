/* eslint-disable no-underscore-dangle */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ASCClient from '@amityco/js-sdk';

import { ThemeProvider } from 'styled-components';
import { NotificationsContainer } from '~/core/components/Notification';
import { ConfirmContainer } from '~/core/components/Confirm';
import { CustomComponentsProvider } from '~/core/hocs/customization';
import { SDKProvider } from '~/core/hocs/withSDK';
import MockData from '~/mock';
import ConfigProvider from '~/social/providers/ConfigProvider';
import NavigationProvider from '~/social/providers/NavigationProvider';
import PostRendererProvider from '~/social/providers/PostRendererProvider';
import Localisation from './Localisation';
import buildGlobalTheme from './theme';
import { UIStyles } from './styles';

let client;

const UiKitProvider = ({
  apiKey,
  authToken,
  userId,
  displayName,
  customComponents = {},
  theme = {},
  children /* TODO localization */,
  postRenderers,
  actionHandlers,
  socialCommunityCreationButtonVisible,
}) => {
  const theGlobal = /* globalThis || */ window || global;

  theGlobal.__asc__ = {
    ...theGlobal.__asc__,
    uikit: __VERSION__,
  };

  const SDKInfo = useMemo(() => {
    if (!client) client = new ASCClient({ apiKey });
    else if (client.currentUserId !== userId) client.unregisterSession();

    if (!client.currentUserId) {
      client.registerSession({
        userId,
        displayName,
        authToken,
      });
    }

    return { client };
  }, [apiKey, userId, displayName, authToken]);

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Helmet>
      <Localisation locale="en">
        <ThemeProvider theme={buildGlobalTheme(theme)}>
          <UIStyles>
            <SDKProvider value={SDKInfo}>
              <ConfigProvider config={{ socialCommunityCreationButtonVisible }}>
                <CustomComponentsProvider value={customComponents}>
                  <NavigationProvider {...actionHandlers}>
                    <PostRendererProvider postRenderers={postRenderers}>
                      <MockData>{children}</MockData>
                      <NotificationsContainer />
                      <ConfirmContainer />
                    </PostRendererProvider>
                  </NavigationProvider>
                </CustomComponentsProvider>
              </ConfigProvider>
            </SDKProvider>
          </UIStyles>
        </ThemeProvider>
      </Localisation>
    </>
  );
};

UiKitProvider.propTypes = {
  apiKey: PropTypes.string.isRequired,
  authToken: PropTypes.string,
  userId: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  customComponents: PropTypes.object,
  theme: PropTypes.shape({
    palette: PropTypes.object,
    typography: PropTypes.object,
  }),
  children: PropTypes.node,
  postRenderers: PropTypes.object,
  actionHandlers: PropTypes.shape({
    onChangePage: PropTypes.func,
    onClickCategory: PropTypes.func,
    onClickCommunity: PropTypes.func,
    onClickUser: PropTypes.func,
    onCommunityCreated: PropTypes.func,
    onEditCommunity: PropTypes.func,
    onEditUser: PropTypes.func,
    onMessageUser: PropTypes.func,
  }),
  socialCommunityCreationButtonVisible: PropTypes.bool,
};

export default UiKitProvider;
