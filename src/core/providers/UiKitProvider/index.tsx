import './inter.css';
import './index.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Client as ASCClient } from '@amityco/ts-sdk';

import { ThemeProvider } from 'styled-components';
import { NotificationsContainer } from '~/core/components/Notification';
import { ConfirmContainer } from '~/core/components/Confirm';
import ConfigProvider from '~/social/providers/ConfigProvider';
import Localization from './Localization';
import buildGlobalTheme from './theme';
import { UIStyles } from './styles';
import { SDKContext } from '../SDKProvider';
import useUser from '~/core/hooks/useUser';
import NavigationProvider from '~/social/providers/NavigationProvider';
import SDKConnectorProvider from '../SDKConnectorProvider';
import CustomComponentsProvider, { CustomComponentType } from '../CustomComponentsProvider';
import PostRendererProvider, {
  PostRendererConfigType,
} from '~/social/providers/PostRendererProvider';
import { Config, CustomizationProvider } from '~/social/v4/providers/CustomizationProvider';

import amityConfig from '../../../../amity-uikit.config.json';
import { PageBehaviorProvider } from '~/social/v4/providers/PageBehaviorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface UiKitProviderProps {
  apiKey: string;
  apiRegion: string;
  apiEndpoint?: {
    http?: string;
    mqtt?: string;
  };
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
  };
  pageBehavior?: {
    closeAction?: () => void;
    hyperLinkAction?: () => void;
  };
  socialCommunityCreationButtonVisible?: boolean;
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  getAuthToken?: () => Promise<string>;
}

const UiKitProvider = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  userId,
  displayName,
  customComponents = {},
  postRendererConfig,
  theme = {},
  children /* TODO localization */,
  socialCommunityCreationButtonVisible,
  actionHandlers,
  pageBehavior,
  onConnectionStatusChange,
  onDisconnected,
  getAuthToken,
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
    login();

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
        <CustomizationProvider initialConfig={amityConfig as Config}>
          <ThemeProvider theme={buildGlobalTheme(theme)}>
            <UIStyles>
              <SDKContext.Provider value={sdkContextValue}>
                <SDKConnectorProvider>
                  <CustomComponentsProvider config={customComponents}>
                    <ConfigProvider
                      config={{
                        socialCommunityCreationButtonVisible:
                          socialCommunityCreationButtonVisible || true,
                      }}
                    >
                      <PostRendererProvider config={postRendererConfig}>
                        <NavigationProvider {...actionHandlers}>
                          <PageBehaviorProvider customNavigationBehavior={pageBehavior}>
                            {children}
                          </PageBehaviorProvider>
                        </NavigationProvider>
                      </PostRendererProvider>
                    </ConfigProvider>
                    <NotificationsContainer />
                    <ConfirmContainer />
                  </CustomComponentsProvider>
                </SDKConnectorProvider>
              </SDKContext.Provider>
            </UIStyles>
          </ThemeProvider>
        </CustomizationProvider>
      </Localization>
    </QueryClientProvider>
  );
};

export default UiKitProvider;
