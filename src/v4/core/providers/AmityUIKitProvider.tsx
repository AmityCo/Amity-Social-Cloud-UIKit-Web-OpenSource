import './index.css';
import '~/v4/styles/global.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import SDKConnectorProvider from '~/v4/core/providers/SDKConnectorProvider';
import {
  initialSDKContext,
  SDKContext,
  type SDKContextType,
} from '~/v4/core/providers/SDKProvider';
import NavigationProvider from './NavigationProvider';

import ConfigProvider from '~/v4/social/providers/ConfigProvider';
import { ConfirmModal } from '~/v4/core/components/ConfirmModal';
import { NotificationsContainer } from '~/v4/core/components/Notification';
import { DrawerContainer } from '~/v4/core/components/Drawer';

import { LocaleProvider, defaultLocaleMap, type LocaleBundle } from '~/v4/core/localization';

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
import { NotificationProvider, useNotifications } from '~/v4/core/providers/NotificationProvider';
import { DrawerProvider } from '~/v4/core/providers/DrawerProvider';
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
import { VisitorUsageLimitPage } from '~/v4/social/pages/VisitorUsageLimitPage';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { Client, CommunityRepository, UserTypeEnum } from '@amityco/ts-sdk';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { UserCacheProvider } from '~/v4/core/providers/UserCacheProvider';
import {
  consumePendingVisitorJoin,
  beginVisitorAutoJoin,
  completeVisitorAutoJoin,
} from '~/v4/core/stores/pendingVisitorJoin';

const InternalComponent = ({
  apiKey,
  apiRegion,
  apiEndpoint,
  userId,
  displayName,
  theme = {},
  children,
  socialCommunityCreationButtonVisible,
  hideExplore,
  pageBehavior,
  onConnectionStatusChange,
  onConnected,
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
  const [isVisitorUsageLimitReached, setIsVisitorUsageLimitReached] = useState<boolean>(false);
  const isVisitorUsageLimitReachedRef = useRef<boolean>(false);

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

  const onVisitorUsageLimitReached = () => {
    if (pageBehavior?.AmityGlobalBehavior?.handleVisitorUsageLimitReached) {
      pageBehavior.AmityGlobalBehavior.handleVisitorUsageLimitReached();
    } else {
      isVisitorUsageLimitReachedRef.current = true;
      setIsVisitorUsageLimitReached(true);
    }
  };

  const onUserDeleted = (payload: Amity.UserPayload) => {
    if (payload.users.find((user) => user.userId === userId)?.isGlobalBan) {
      setIsUserDeleted(true);
    }
  };

  // Auto-join the community a visitor tapped "Join" on before signing in.
  //
  // A visitor's join intent is recorded (module-level, so it survives the
  // provider remount that the visitor -> signed-in transition triggers) in
  // useCommunityProfileGlobalBehavior. Once we connect as a signed-in user, we
  // consume that intent and join on their behalf. The newsfeed watches the
  // auto-join status and holds a loading state until it settles, so it renders
  // ONCE with the just-joined community included instead of flashing an empty /
  // pre-join feed and re-fetching. Runs on every connect (via onConnected) but
  // is a no-op unless there is a pending id AND the session is now signed-in —
  // so a reconnect as a visitor never triggers it.
  const autoJoinPendingCommunity = () => {
    const isSignedIn = Client.getCurrentUserType() === UserTypeEnum.SIGNED_IN;
    if (!isSignedIn) return;

    const pendingCommunityId = consumePendingVisitorJoin();
    if (!pendingCommunityId) return;

    // Enter the loading state before the network call so a newsfeed mounting
    // during the transition waits rather than rendering the pre-join feed.
    beginVisitorAutoJoin();

    // We only have the communityId here (the intent is stored by id so it can
    // survive the visitor -> signed-in provider remount). The live community
    // object's `.join()` is not available without first observing it, so we use
    // the id-based repository call. It is marked "will be deprecated" but is the
    // supported way to join purely by id and matches the React Native UIKit.
    CommunityRepository.joinCommunity(pendingCommunityId)
      .then(() => {
        // The join request has resolved, but the global feed's server-side view
        // of the new membership can lag a beat behind. Wait briefly before
        // releasing the newsfeed so its first (and only) query already includes
        // the joined community's posts — no empty-then-populated flicker.
        return new Promise<void>((resolve) => setTimeout(resolve, 1200));
      })
      .catch((autoJoinError: unknown) => {
        // Best-effort: if the auto-join fails (e.g. private community requiring
        // approval, or a transient network error) we simply drop it — the user
        // can still join manually now that they are signed in.
        console.error('Auto-join community failed:', autoJoinError);
      })
      .finally(() => {
        // Release the newsfeed whether the join succeeded or failed, so it never
        // stays stuck in a loading state.
        completeVisitorAutoJoin();
      });
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
          onConnected: () => {
            // Auto-join any community a visitor tapped Join on before signing in
            // (no-op unless there is a pending id and the session is signed-in),
            // then forward to the host's onConnected callback.
            autoJoinPendingCommunity();
            onConnected?.();
          },
          onDisconnected,
          onGlobalBanned,
          onUserDeleted,
          onVisitorUsageLimitReached,
        });

        // Only expose the client to the render tree if the visitor usage limit
        // was not already hit synchronously during registerDevice. This prevents
        // a single-frame flash of the main community content before the
        // VisitorUsageLimitPage guard kicks in.
        if (!isVisitorUsageLimitReachedRef.current) {
          setClient(newClient);
        }
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
  }, [userId, displayName, onConnectionStatusChange, onConnected, onDisconnected]);

  if (isGlobalBanned) return <GlobalBan />;

  if (isUserDeleted) return <FailedToShow />;

  if (isVisitorUsageLimitReached) {
    const handleSignIn = pageBehavior?.AmityGlobalBehavior?.handleVisitorUsageLimitSignIn
      ? () =>
          pageBehavior.AmityGlobalBehavior!.handleVisitorUsageLimitSignIn!({ alignment: 'fixed' })
      : undefined;
    return (
      <div className="asc-uikit">
        <CustomizationProvider initialConfig={initialConfig}>
          <VisitorUsageLimitPage onSignIn={handleSignIn} />
        </CustomizationProvider>
      </div>
    );
  }

  if (!client || isNetworkConfigLoading) return null;

  return (
    <div className="asc-uikit">
      <CustomizationProvider initialConfig={initialConfig}>
        <CustomReactionProvider>
          <AdEngineProvider>
            <FeedScrollProvider>
              <SDKContext.Provider value={sdkContextValue}>
                <UserCacheProvider>
                  <SDKConnectorProvider>
                    <ConfigProvider
                      config={{
                        socialCommunityCreationButtonVisible:
                          socialCommunityCreationButtonVisible ?? true,
                        hideExplore: hideExplore ?? false,
                      }}
                    >
                      <LayoutProvider>
                        <NavigationProvider
                          activeRoute={activeRoute}
                          onRouteChange={onRouteChange}
                          onEmptyNavigationStack={onEmptyNavigationStack}
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
                    </ConfigProvider>
                  </SDKConnectorProvider>
                </UserCacheProvider>
              </SDKContext.Provider>
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
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  socialCommunityCreationButtonVisible?: boolean;
  hideExplore?: boolean;
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
  /**
   * Localization configuration for the UIKit.
   * - `localeBundle`: initial Level 3 locale bundle (key → translated string)
   * - `overrides`: initial Level 2 programmatic overrides (merge with locale)
   * - `localeMap`: map of locale code → bundle for automatic device-language detection.
   *   When `localeBundle` is not set the provider checks `navigator.language` against
   *   this map (exact match, then language-prefix). Falls back to English if no match.
   *
   * @example
   *   localization={{ localeBundle: jaLocale }}
   * @example
   *   localization={{ localeMap: { ja: jaLocale, th: thLocale } }}
   */
  localization?: {
    localeBundle?: LocaleBundle;
    overrides?: LocaleBundle;
    localeMap?: Record<string, LocaleBundle>;
  };
}

const queryClient = new QueryClient();

const AmityUIKitProvider: React.FC<AmityUIKitProviderProps> = (props) => {
  return (
    <LocaleProvider
      initialLocaleBundle={props.localization?.localeBundle}
      initialOverrides={props.localization?.overrides}
      localeMap={props.localization?.localeMap ?? defaultLocaleMap}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider config={props.configs}>
          <NotificationProvider>
            <ConfirmProvider>
              <InternalComponent {...props} />
              <NotificationsContainer />
              <ConfirmModal />
            </ConfirmProvider>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LocaleProvider>
  );
};

export default AmityUIKitProvider;
