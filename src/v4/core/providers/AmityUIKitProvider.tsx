import '../../../core/providers/UiKitProvider/inter.css';
import './index.css';
import '../../styles/global.css';
import amityUKitConfig from '../../../../amity-uikit.config.json';

import React, { useEffect, useMemo, useState } from 'react';
import useUser from '~/core/hooks/useUser';

import SDKConnectorProvider from '~/core/providers/SDKConnectorProvider';
import { SDKContext } from '~/core/providers/SDKProvider';
import PostRendererProvider from '~/social/providers/PostRendererProvider';
import NavigationProvider from '~/social/providers/NavigationProvider';

import ConfigProvider from '~/social/providers/ConfigProvider';
import { ConfirmContainer } from '~/v4/core/components/ConfirmModal';
import { NotificationsContainer } from '~/v4/core/components/Notification';

import Localization from '~/core/providers/UiKitProvider/Localization';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import buildGlobalTheme from '~/core/providers/UiKitProvider/theme';
import { Config, CustomizationProvider } from './CustomizationProvider';
import { ThemeProvider } from './ThemeProvider';
import { PageBehaviorProvider } from './PageBehaviorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIStyles } from '~/core/providers/UiKitProvider/styles';
import AmityUIKitManager from '../AmityUIKitManager';

export type AmityUIKitConfig = typeof amityUKitConfig;

interface AmityUIKitProviderProps {
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
  pageBehavior?: {
    onCloseAction?: () => void;
    onClickHyperLink?: () => void;
  };
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  configs?: AmityUIKitConfig;
}

const apiKey = import.meta.env.STORYBOOK_API_KEY;
const apiRegion = import.meta.env.STORYBOOK_API_REGION;

const AmityUIKitProvider: React.FC<AmityUIKitProviderProps> = ({
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
        AmityUIKitManager.setup({ apiKey, endpoint: apiRegion });

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
    <QueryClientProvider client={queryClient}>
      <Localization locale="en">
        <CustomizationProvider initialConfig={configs as Config}>
          <StyledThemeProvider theme={buildGlobalTheme(theme)}>
            <ThemeProvider initialConfig={configs?.theme}>
              <UIStyles>
                <SDKContext.Provider value={sdkContextValue}>
                  <SDKConnectorProvider>
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
                    <ConfirmContainer />
                  </SDKConnectorProvider>
                </SDKContext.Provider>
              </UIStyles>
            </ThemeProvider>
          </StyledThemeProvider>
        </CustomizationProvider>
      </Localization>
    </QueryClientProvider>
  );
};

export default AmityUIKitProvider;
