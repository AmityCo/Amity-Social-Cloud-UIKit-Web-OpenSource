import './inter.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Client as ASCClient } from '@amityco/ts-sdk';

import { ThemeProvider } from 'styled-components';
import { NotificationsContainer } from '~/core/components/Notification';
import { ConfirmComponent } from '~/core/components/Confirm';
import { NotificationsContainer as NotificationsContainerV4 } from '~/v4/core/components/Notification';
import { ConfirmComponent as ConfirmComponentV4 } from '~/v4/core/components/ConfirmModal';
import ConfigProvider from '~/social/providers/ConfigProvider';
import Localization from './Localization';
import buildGlobalTheme from './theme';
import { UIStyles } from './styles';
import { SDKContext } from '../SDKProvider';
import { SDKContext as SDKContextV4 } from '~/v4/core/providers/SDKProvider';
import useUser from '~/core/hooks/useUser';
import NavigationProvider from '~/social/providers/NavigationProvider';
import SDKConnectorProvider from '~/core/providers/SDKConnectorProvider';
import SDKConnectorProviderV4 from '~/v4/core/providers/SDKConnectorProvider';
import CustomComponentsProvider, { CustomComponentType } from '../CustomComponentsProvider';
import PostRendererProvider, {
  PostRendererConfigType,
} from '~/social/providers/PostRendererProvider';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfirmProvider as ConfirmProviderV4 } from '~/v4/core/providers/ConfirmProvider';
import { NotificationProvider as NotificationProviderV4 } from '~/v4/core/providers/NotificationProvider';
import { ConfirmProvider } from '~/core/providers/ConfirmProvider';
import { NotificationProvider } from '~/core/providers/NotificationProvider';
import { CustomizationProvider } from '~/v4/core/providers/CustomizationProvider';

interface UiKitProviderProps {
  apiKey: string;
  apiRegion: string;
  apiEndpoint?: {
    http?: string;
    mqtt?: string;
  };
  authToken?: string;
  userId: string;
  displayName: string;
  customComponents?: CustomComponentType;
  postRendererConfig?: PostRendererConfigType;
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  actionHandlers?: {
    onChangePage?: (data: { type: string; [x: string]: string | boolean }) => void;
    onClickCategory?: (categoryId: string) => void;
    onClickCommunity?: (communityId: string) => void;
    onClickUser?: (userId: string) => void;
    onCommunityCreated?: (communityId: string) => void;
    onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
    onEditUser?: (userId: string) => void;
    onMessageUser?: (userId: string) => void;
    onBack?: () => void;
  };
  socialCommunityCreationButtonVisible?: boolean;
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  pageBehavior?: Record<string, unknown>;
}

const UiKitProvider = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  authToken,
  userId,
  displayName,
  customComponents = {},
  postRendererConfig,
  theme = {},
  children /* TODO localization */,
  socialCommunityCreationButtonVisible,
  actionHandlers,
  onConnectionStatusChange,
  onDisconnected,
}: UiKitProviderProps) => {
  const queryClient = new QueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<Amity.Client | null>(null);
  const stateChangeRef = useRef<(() => void) | null>(null);
  const disconnectedChangeRef = useRef<(() => void) | null>(null);
  const currentUser = useUser(userId);
  const sdkContextValue = useMemo(
    () => ({
      client: client || null,
      currentUserId: userId || undefined,
      userRoles: currentUser?.roles ?? [],
    }),
    [client, userId, currentUser?.roles],
  );

  async function login() {
    try {
      const currentClient = ASCClient.getActiveClient();
      setClient(currentClient);
    } catch {
      const ascClient = ASCClient.createClient(
        apiKey,
        apiRegion,
        apiEndpoint ? { apiEndpoint } : {},
      );
      setClient(ascClient);
    }

    await ASCClient.login(
      { userId, displayName, authToken },
      {
        sessionWillRenewAccessToken(renewal) {
          // secure mode
          if (authToken) {
            renewal.renewWithAuthToken(authToken);
            return;
          }

          renewal.renew();
        },
      },
    );
    setIsConnected(true);

    if (stateChangeRef.current == null) {
      stateChangeRef.current = ASCClient.onSessionStateChange((state) => {
        onConnectionStatusChange?.(state);
      });
    }

    if (disconnectedChangeRef.current == null) {
      disconnectedChangeRef.current = ASCClient.onClientDisconnected(() => {
        onDisconnected && onDisconnected();
      });
    }
  }

  useEffect(() => {
    async function run() {
      await login();
    }

    run();

    return () => {
      stateChangeRef.current?.();
      disconnectedChangeRef.current?.();
    };
  }, [userId]);

  if (client == null) return <></>;
  if (!isConnected) return <></>;

  return (
    <QueryClientProvider client={queryClient}>
      <Localization locale="en">
        <ThemeProvider theme={buildGlobalTheme(theme)}>
          <UIStyles>
            <SDKContext.Provider value={sdkContextValue}>
              <SDKContextV4.Provider value={sdkContextValue}>
                <SDKConnectorProvider>
                  <SDKConnectorProviderV4>
                    <ConfirmProvider>
                      <ConfirmProviderV4>
                        <NotificationProvider>
                          <NotificationProviderV4>
                            <CustomizationProvider initialConfig={{}}>
                              <CustomComponentsProvider config={customComponents}>
                                <ConfigProvider
                                  config={{
                                    socialCommunityCreationButtonVisible:
                                      socialCommunityCreationButtonVisible || true,
                                  }}
                                >
                                  <PostRendererProvider config={postRendererConfig}>
                                    <NavigationProvider {...actionHandlers}>
                                      {children}
                                    </NavigationProvider>
                                  </PostRendererProvider>
                                </ConfigProvider>
                                <NotificationsContainer />
                                <NotificationsContainerV4 />
                                <ConfirmComponent />
                                <ConfirmComponentV4 />
                              </CustomComponentsProvider>
                            </CustomizationProvider>
                          </NotificationProviderV4>
                        </NotificationProvider>
                      </ConfirmProviderV4>
                    </ConfirmProvider>
                  </SDKConnectorProviderV4>
                </SDKConnectorProvider>
              </SDKContextV4.Provider>
            </SDKContext.Provider>
          </UIStyles>
        </ThemeProvider>
      </Localization>
    </QueryClientProvider>
  );
};

export default UiKitProvider;
