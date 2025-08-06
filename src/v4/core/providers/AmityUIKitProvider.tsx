import './index.css';
import '~/v4/styles/global.css';

import React, { useEffect, useMemo, useState } from 'react';
import useUser from '~/core/hooks/useUser';

import SDKConnectorProviderV3 from '~/core/providers/SDKConnectorProvider';
import SDKConnectorProvider from '~/v4/core/providers/SDKConnectorProvider';
import {
  initialSDKContext,
  SDKContext,
  type SDKContextType,
} from '~/v4/core/providers/SDKProvider';
import { SDKContext as SDKContextV3 } from '~/core/providers/SDKProvider';
import PostRendererProvider from '~/social/providers/PostRendererProvider';
import NavigationProvider from './NavigationProvider';

import ConfigProvider from '~/v4/social/providers/ConfigProvider';
import { ConfirmModal } from '~/v4/core/components/ConfirmModal';
import { ConfirmComponent as LegacyConfirmComponent } from '~/core/components/Confirm';
import { NotificationsContainer } from '~/v4/core/components/Notification';
import { DrawerContainer } from '~/v4/core/components/Drawer';
import { NotificationsContainer as LegacyNotificationsContainer } from '~/core/components/Notification';

import Localization from '~/core/providers/UiKitProvider/Localization';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import buildGlobalTheme from '~/core/providers/UiKitProvider/theme';
import {
  defaultConfig,
  Config,
  CustomizationProvider,
} from '~/v4/core/providers/CustomizationProvider';
import { ThemeProvider } from './ThemeProvider';
import { PageBehavior, PageBehaviorProvider } from './PageBehaviorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';
import { ConfirmProvider } from '~/v4/core/providers/ConfirmProvider';
import { ConfirmProvider as LegacyConfirmProvider } from '~/core/providers/ConfirmProvider';
import { NotificationProvider, useNotifications } from '~/v4/core/providers/NotificationProvider';
import { DrawerProvider } from '~/v4/core/providers/DrawerProvider';
import { NotificationProvider as LegacyNotificationProvider } from '~/core/providers/NotificationProvider';
import { CustomReactionProvider } from './CustomReactionProvider';
import { AdEngineProvider } from './AdEngineProvider';
import { AdEngine } from '~/v4/core/AdEngine';
import { GlobalFeedProvider } from '~/v4/social/providers/GlobalFeedProvider';
import { PopupProvider } from '~/v4/core/providers/PopupProvider';
import { Popup } from '~/v4/core/components/AriaPopup';
import { CommunitySetupProvider } from '~/v4/social/providers/CommunitySetupProvider';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';
import { LayoutProvider } from '~/v4/social/providers/LayoutProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNetworkConfig } from '~/v4/core/hooks/useNetworkConfig';
import { ClipProvider } from '~/v4/social/providers/ClipProvider';
import { FeedScrollProvider } from '~/v4/core/providers/FeedScrollProvider';
import { SearchResultProvider } from '~/v4/social/providers/SearchResultProvider';
import { GlobalBan } from '~/v4/social/internal-components/GlobalBan';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { Client, UserTypeEnum } from '@amityco/ts-sdk';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';

const InternalComponent = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  userId,
  displayName,
  postRendererConfig,
  theme = {},
  children /* TODO localization */,
  socialCommunityCreationButtonVisible,
  pageBehavior,
  onConnectionStatusChange,
  onDisconnected,
  getAuthToken,
  getAuthSignature,
  authSignatureExpiresAt,
  configs,
  activeRoute,
  onRouteChange,
  seoOptimizationEnabled = false,
  syncNetworkConfig = false,
  onEmptyNavigationStack,
}: AmityUIKitProviderProps) => {
  const { error } = useNotifications();
  const [client, setClient] = useState<Amity.Client | null>(null);
  const { networkConfig, isNetworkConfigLoading } = useNetworkConfig(client);
  const [isGlobalBanned, setIsGlobalBanned] = useState<boolean>(false);
  const [isUserDeleted, setIsUserDeleted] = useState<boolean>(false);

  const sdkContextValue: SDKContextType = useMemo(() => {
    if (!client) return initialSDKContext;

    const currentUser = Client.getCurrentUser();
    const userType = Client.getCurrentUserType();

    return {
      client,
      currentUserId: currentUser?.userId,
      userRoles: currentUser?.roles || [],
      currentUser,
      isVisitorOrBot: userType !== UserTypeEnum.SIGNED_IN,
    };
  }, [client, userId]);

  const initialConfig = useMemo(() => {
    let initialConfig = { ...defaultConfig };

    if (configs) {
      initialConfig = {
        ...initialConfig,
        ...configs,
        theme: {
          light: { ...initialConfig.theme.light, ...configs.theme?.light },
          dark: { ...initialConfig.theme.dark, ...configs.theme?.dark },
        },
      };
    }

    if (networkConfig && syncNetworkConfig) {
      if (
        networkConfig.config?.preferred_theme === 'dark' ||
        networkConfig.config?.preferred_theme === 'light'
      )
        initialConfig = {
          ...initialConfig,
          ...networkConfig.config,
        };
    }

    return initialConfig;
  }, [configs, networkConfig]);

  const onGlobalBanned = (payload: Amity.UserPayload) => {
    if (payload.users.find((user) => user.userId === userId)?.isGlobalBan) {
      setIsGlobalBanned(true);
    }
  };

  const onUserDeleted = (payload: Amity.UserPayload) => {
    if (payload.users.find((user) => user.userId === userId)?.isGlobalBan) {
      setIsUserDeleted(true);
    }
  };

  useEffect(() => {
    const setup = async () => {
      let authToken;

      if (getAuthToken) {
        authToken = await getAuthToken();
      }

      try {
        // Set up the AmityUIKitManager
        AmityUIKitManager.setup({ apiKey, apiRegion, apiEndpoint, seoOptimizationEnabled });
        AdEngine.instance;

        const newClient = AmityUIKitManager.getClient();
        const deviceId = await newClient?.getVisitorDeviceId();

        let authSignatureParams;

        if (getAuthSignature && authSignatureExpiresAt && deviceId) {
          const authSignature = await getAuthSignature({
            deviceId,
            authSignatureExpiresAt,
          });

          authSignatureParams = {
            authSignature,
            authSignatureExpiresAt,
          };
        }

        // Register the device and get the client instance
        await AmityUIKitManager.registerDevice({
          userId: userId?.toString(),
          displayName: displayName?.toString(),
          sessionHandler: {
            sessionWillRenewAccessToken: (renewal) => {
              // Handle access token renewal
              if (getAuthToken) {
                getAuthToken().then((newToken) => {
                  renewal.renewWithAuthToken(newToken);
                });
              } else {
                renewal.renew();
              }
            },
          },
          authToken,
          authSignatureParams,
          onConnectionStatusChange,
          undefined,
          onDisconnected,
          onGlobalBanned,
          onUserDeleted,
        });

        setClient(newClient);
      } catch (_error) {
        console.error('Error setting up AmityUIKitManager:', _error);
        if (_error instanceof Error) {
          if (_error.message.includes(ERROR_RESPONSE.GLOBAL_BAN)) {
            setIsGlobalBanned(true);
          } else {
            error({ content: _error.message });
          }
        }
      }
    };

    setup();
  }, [userId, displayName, onConnectionStatusChange, onDisconnected]);

  if (isGlobalBanned) return <GlobalBan />;

  if (isUserDeleted) return <FailedToShow />;

  if (!client || isNetworkConfigLoading) return null;

  return (
    <div className="asc-uikit">
      <CustomizationProvider initialConfig={initialConfig}>
        <CustomReactionProvider>
          <AdEngineProvider>
            <FeedScrollProvider>
              <SDKContextV3.Provider value={sdkContextValue}>
                <SDKContext.Provider value={sdkContextValue}>
                  <SDKConnectorProviderV3>
                    <SDKConnectorProvider>
                      <ConfigProvider
                        config={{
                          socialCommunityCreationButtonVisible:
                            socialCommunityCreationButtonVisible || true,
                        }}
                      >
                        <PostRendererProvider config={postRendererConfig}>
                          <LayoutProvider>
                            <NavigationProvider
                              activeRoute={activeRoute}
                              onRouteChange={onRouteChange}
                            >
                              <PageBehaviorProvider pageBehavior={pageBehavior}>
                                <SearchResultProvider>
                                  <StoryProvider>
                                    <ClipProvider>
                                      <CommunitySetupProvider>
                                        <DrawerProvider>
                                          <GlobalFeedProvider>
                                            <PopupProvider>
                                              <Popup />
                                              {children}
                                            </PopupProvider>
                                          </GlobalFeedProvider>
                                          <DrawerContainer />
                                        </DrawerProvider>
                                      </CommunitySetupProvider>
                                    </ClipProvider>
                                  </StoryProvider>
                                </SearchResultProvider>
                              </PageBehaviorProvider>
                            </NavigationProvider>
                          </LayoutProvider>
                        </PostRendererProvider>
                      </ConfigProvider>
                    </SDKConnectorProvider>
                  </SDKConnectorProviderV3>
                </SDKContext.Provider>
              </SDKContextV3.Provider>
            </FeedScrollProvider>
          </AdEngineProvider>
        </CustomReactionProvider>
      </CustomizationProvider>
    </div>
  );
};

export type AmityUIKitConfig = Config;

export type AmityRoute = {
  route: string;
  id?: string;
};

interface AmityUIKitProviderProps {
  apiKey: string;
  apiRegion: string;
  apiEndpoint?: {
    http?: string;
    mqtt?: string;
    upload?: string;
  };
  userId?: string;
  displayName?: string;
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
  getAuthToken?: () => Promise<string>;
  authSignatureExpiresAt?: string;
  getAuthSignature?: ({
    deviceId,
    authSignatureExpiresAt,
  }: {
    deviceId: string;
    authSignatureExpiresAt: string;
  }) => Promise<string>;
  isBotUser?: boolean;
  configs?: AmityUIKitConfig;
  activeRoute?: AmityRoute;
  onRouteChange?: (route: AmityRoute) => void;
  seoOptimizationEnabled?: boolean;
  syncNetworkConfig?: boolean;
  onEmptyNavigationStack?: () => void;
}

const queryClient = new QueryClient();

const AmityUIKitProvider: React.FC<AmityUIKitProviderProps> = (props) => {
  return (
    <Localization locale="en">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider config={props.configs}>
          <StyledThemeProvider theme={buildGlobalTheme(props.theme)}>
            <NotificationProvider>
              <LegacyNotificationProvider>
                <ConfirmProvider>
                  <LegacyConfirmProvider>
                    <InternalComponent {...props} />
                    <NotificationsContainer />
                    <LegacyNotificationsContainer />
                    <ConfirmModal />
                    <LegacyConfirmComponent />
                  </LegacyConfirmProvider>
                </ConfirmProvider>
              </LegacyNotificationProvider>
            </NotificationProvider>
          </StyledThemeProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </Localization>
  );
};

export default AmityUIKitProvider;
