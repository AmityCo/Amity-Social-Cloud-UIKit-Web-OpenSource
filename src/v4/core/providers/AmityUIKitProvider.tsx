import '../../../core/providers/UiKitProvider/inter.css';
import './index.css';
import '../../styles/global.css';

import React, { useEffect, useMemo, useState } from 'react';
import useUser from '~/core/hooks/useUser';

import SDKConnectorProviderV3 from '~/core/providers/SDKConnectorProvider';
import SDKConnectorProvider from '~/v4/core/providers/SDKConnectorProvider';
import { SDKContext } from '~/v4/core/providers/SDKProvider';
import { SDKContext as SDKContextV3 } from '~/core/providers/SDKProvider';
import PostRendererProvider from '~/social/providers/PostRendererProvider';
import NavigationProvider from './NavigationProvider';

import ConfigProvider from '~/social/providers/ConfigProvider';
import { ConfirmComponent } from '~/v4/core/components/ConfirmModal';
import { ConfirmComponent as LegacyConfirmComponent } from '~/core/components/Confirm';
import { NotificationsContainer } from '~/v4/core/components/Notification';
import { DrawerContainer } from '~/v4/core/components/Drawer';
import { NotificationsContainer as LegacyNotificationsContainer } from '~/core/components/Notification';

import Localization from '~/core/providers/UiKitProvider/Localization';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import buildGlobalTheme from '~/core/providers/UiKitProvider/theme';
import { defaultConfig, Config, CustomizationProvider } from './CustomizationProvider';
import { ThemeProvider } from './ThemeProvider';
import { PageBehavior, PageBehaviorProvider } from './PageBehaviorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIStyles } from '~/core/providers/UiKitProvider/styles';
import AmityUIKitManager from '../AmityUIKitManager';
import { ConfirmProvider } from '~/v4/core/providers/ConfirmProvider';
import { ConfirmProvider as LegacyConfirmProvider } from '~/core/providers/ConfirmProvider';
import { NotificationProvider } from '~/v4/core/providers/NotificationProvider';
import { DrawerProvider } from '~/v4/core/providers/DrawerProvider';
import { NotificationProvider as LegacyNotificationProvider } from '~/core/providers/NotificationProvider';
import { CustomReactionProvider } from './CustomReactionProvider';

export type AmityUIKitConfig = Config;

interface AmityUIKitProviderProps {
  apiKey: string;
  apiRegion: string;
  apiEndpoint?: {
    http?: string;
    mqtt?: string;
  };
  authToken?: string;
  userId: string;
  displayName: string;
  postRendererConfig?: any;
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  socialCommunityCreationButtonVisible?: boolean;
  actionHandlers?: {
    onChangePage?: (data: { type: string; [x: string]: string | boolean }) => void;
    onClickCategory?: (categoryId: string) => void;
    onClickCommunity?: (communityId: string) => void;
    onClickUser?: (userId: string) => void;
    onCommunityCreated?: (communityId: string) => void;
    onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
    onEditUser?: (userId: string) => void;
    onMessageUser?: (userId: string) => void;
  };
  pageBehavior?: PageBehavior;
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  configs?: AmityUIKitConfig;
}

const AmityUIKitProvider: React.FC<AmityUIKitProviderProps> = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  authToken,
  userId,
  displayName,
  postRendererConfig,
  theme = {},
  children /* TODO localization */,
  socialCommunityCreationButtonVisible,
  pageBehavior,
  onConnectionStatusChange,
  onDisconnected,
  configs,
}) => {
  const queryClient = new QueryClient();
  const [client, setClient] = useState<Amity.Client | null>(null);
  const currentUser = useUser(userId);

  const sdkContextValue = useMemo(
    () => ({
      client,
      currentUserId: userId || undefined,
      userRoles: currentUser?.roles || [],
    }),
    [client, userId, currentUser?.roles],
  );

  useEffect(() => {
    const setup = async () => {
      try {
        // Set up the AmityUIKitManager
        AmityUIKitManager.setup({ apiKey, apiRegion, apiEndpoint });

        // Register the device and get the client instance
        await AmityUIKitManager.registerDevice(
          userId,
          displayName || userId,
          {
            sessionWillRenewAccessToken: (renewal) => {
              // Handle access token renewal
              if (authToken) {
                renewal.renewWithAuthToken(authToken);
              } else {
                renewal.renew();
              }
            },
          },
          onConnectionStatusChange,
          onDisconnected,
        );

        const newClient = AmityUIKitManager.getClient();
        setClient(newClient);
      } catch (error) {
        console.error('Error setting up AmityUIKitManager:', error);
      }
    };

    setup();
  }, [userId, displayName, authToken, onConnectionStatusChange, onDisconnected]);

  if (!client) return null;

  return (
    <div className="asc-uikit">
      <QueryClientProvider client={queryClient}>
        <Localization locale="en">
          <CustomizationProvider initialConfig={configs || defaultConfig}>
            <StyledThemeProvider theme={buildGlobalTheme(theme)}>
              <ThemeProvider>
                <CustomReactionProvider>
                  <SDKContextV3.Provider value={sdkContextValue}>
                    <SDKContext.Provider value={sdkContextValue}>
                      <SDKConnectorProviderV3>
                        <SDKConnectorProvider>
                          <NotificationProvider>
                            <DrawerProvider>
                              <LegacyNotificationProvider>
                                <ConfirmProvider>
                                  <LegacyConfirmProvider>
                                    <ConfigProvider
                                      config={{
                                        socialCommunityCreationButtonVisible:
                                          socialCommunityCreationButtonVisible || true,
                                      }}
                                    >
                                      <PostRendererProvider config={postRendererConfig}>
                                        <NavigationProvider>
                                          <PageBehaviorProvider pageBehavior={pageBehavior}>
                                            {children}
                                          </PageBehaviorProvider>
                                        </NavigationProvider>
                                      </PostRendererProvider>
                                    </ConfigProvider>
                                    <NotificationsContainer />
                                    <LegacyNotificationsContainer />
                                    <ConfirmComponent />
                                    <DrawerContainer />
                                    <LegacyConfirmComponent />
                                  </LegacyConfirmProvider>
                                </ConfirmProvider>
                              </LegacyNotificationProvider>
                            </DrawerProvider>
                          </NotificationProvider>
                        </SDKConnectorProvider>
                      </SDKConnectorProviderV3>
                    </SDKContext.Provider>
                  </SDKContextV3.Provider>
                </CustomReactionProvider>
              </ThemeProvider>
            </StyledThemeProvider>
          </CustomizationProvider>
        </Localization>
      </QueryClientProvider>
    </div>
  );
};

export default AmityUIKitProvider;
