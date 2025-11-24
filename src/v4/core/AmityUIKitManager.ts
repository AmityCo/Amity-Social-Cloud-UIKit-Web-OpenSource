import { Client as ASCClient } from '@amityco/ts-sdk';
import { NetworkConfig } from './providers/CustomizationProvider';
import { v4 as uuid } from 'uuid';

/**
 * Interface representing the session handler for the Amity SDK.
 */
interface SessionHandler {
  /**
   * Handles the access token renewal during the login process.
   * @param renewal - The access token renewal handler.
   */
  sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal): void;
}

/**
 * Interface for the registerDevice parameters.
 */
interface RegisterDeviceParams {
  userId?: string;
  displayName?: string;
  sessionHandler: SessionHandler;
  authToken?: string;
  authSignatureParams?: Amity.ConnectClientAsVisitorParams;
  onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onGlobalBanned?: (payload: Amity.UserPayload) => void;
  onUserDeleted?: (payload: Amity.UserPayload) => void;
}

/**
 * Interface for the connectAndLogin parameters.
 */
interface ConnectAndLoginParams {
  userId?: string;
  displayName?: string;
  sessionHandler: SessionHandler;
  authToken?: string;
  authSignatureParams?: Amity.ConnectClientAsVisitorParams;
  isBotUser?: boolean;
}

/**
 * Manages the Amity SDK client and authentication state.
 */
export class AmityUIKitManager {
  private static instance: AmityUIKitManager | null = null;
  private client: Amity.Client | null = null;
  private isConnected: boolean = false;
  private stateChangeHandler: (() => void) | null = null;
  private disconnectedHandler: (() => void) | null = null;
  private onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  private onConnected?: () => void;
  private onDisconnected?: () => void;
  private globalBannedUnsubscribe?: Amity.Unsubscriber;
  private onGlobalBanned?: (users: Amity.UserPayload) => void;
  private onUserDeleted?: (users: Amity.UserPayload) => void;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {}

  /**
   * Sets up the AmityUIKitManager instance with the provided configuration.
   * @param config - The configuration object containing the API key and endpoint.
   */
  public static setup(config: {
    apiKey: string;
    apiRegion: string;
    apiEndpoint?: {
      http?: string;
      mqtt?: string;
    };
    seoOptimizationEnabled?: boolean;
  }): void {
    if (!AmityUIKitManager.instance) {
      AmityUIKitManager.instance = new AmityUIKitManager();
      const client: Amity.Client = ASCClient.createClient(config.apiKey, config.apiRegion, {
        apiEndpoint: config.apiEndpoint,
        rteEnabled: !config.seoOptimizationEnabled,
      });

      AmityUIKitManager.setClient(client);
    }
  }

  /**
   * Registers a device with the Amity SDK and handles the login process.
   * @param params - The parameters object containing all registration options.
   */
  public static async registerDevice({
    userId,
    displayName,
    sessionHandler,
    authToken,
    authSignatureParams,
    onConnectionStatusChange,
    onConnected,
    onDisconnected,
    onGlobalBanned,
    onUserDeleted,
  }: RegisterDeviceParams): Promise<void> {
    if (!AmityUIKitManager.instance) {
      throw new Error('AmityUIKitManager must be set up first using the setup method.');
    }

    AmityUIKitManager.instance.onConnectionStatusChange = onConnectionStatusChange;
    AmityUIKitManager.instance.onConnected = onConnected;
    AmityUIKitManager.instance.onDisconnected = onDisconnected;
    AmityUIKitManager.instance.onGlobalBanned = onGlobalBanned;
    AmityUIKitManager.instance.onUserDeleted = onUserDeleted;

    await AmityUIKitManager.instance.connectAndLogin({
      userId,
      displayName,
      sessionHandler,
      authToken,
      authSignatureParams,
    });
  }

  /**
   * Sets the AmityClient instance to be used by the AmityUIKitManager.
   * This method is useful when sharing the AmityClient instance between different parts of the application.
   * @param client - The AmityClient instance to be used.
   */
  public static setClient(client: Amity.Client): void {
    if (AmityUIKitManager.instance) {
      AmityUIKitManager.instance.client = client;
      AmityUIKitManager.instance.isConnected = true;
    } else {
      throw new Error('AmityUIKitManager must be set up first using the setup method.');
    }
  }

  /**
   * Connects and logs in to the Amity SDK with the provided user details and session handler.
   * @param userId - The user ID to be used for login.
   * @param displayName - The display name of the user.
   * @param sessionHandler - The session handler for access token renewal.
   */

  private async connectAndLogin({
    userId,
    displayName,
    sessionHandler,
    authToken,
    authSignatureParams,
    isBotUser,
  }: ConnectAndLoginParams): Promise<void> {
    const bindedSessionHandlder = {
      sessionWillRenewAccessToken: sessionHandler.sessionWillRenewAccessToken.bind(sessionHandler),
    };

    if (userId) {
      await ASCClient.login({ userId, displayName, authToken }, bindedSessionHandlder);
    } else if (!userId && isBotUser) {
      await ASCClient.loginAsBot({
        sessionHandler: bindedSessionHandlder,
      });
    } else
      await ASCClient.loginAsVisitor({
        ...authSignatureParams,
        sessionHandler: bindedSessionHandlder,
      });

    this.stateChangeHandler = ASCClient.onSessionStateChange((state: Amity.SessionStates) => {
      this.onConnectionStatusChange?.(state);
    });

    this.disconnectedHandler = ASCClient.onClientDisconnected(() => {
      this.onDisconnected && this.onDisconnected();
    });

    this.onConnected && this.onConnected();

    this.globalBannedUnsubscribe = ASCClient.onClientBanned((payload) => {
      this.onGlobalBanned?.(payload);
    });

    // TODO: confirm if we have this on SDK - confirm with mobile platform

    // this.deletedUserUnsubscribe = ASCClient.onUserDeleted((payload) => {
    //   this.onGlobalBanned?.(payload);
    // });

    try {
      const sharableLinkConfig = await ASCClient.getShareableLinkConfiguration();
      localStorage.setItem('sharableLinkConfig', JSON.stringify(sharableLinkConfig || {}));
    } catch (e) {
      localStorage.setItem('sharableLinkConfig', JSON.stringify({}));
    }
  }

  /**
   * Disconnects from the Amity SDK and cleans up resources.
   */
  public disconnect(): void {
    this.stateChangeHandler?.();
    this.disconnectedHandler?.();
    this.globalBannedUnsubscribe?.();
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Retrieves the Amity SDK client instance.
   * @returns The Amity SDK client instance or null if not connected.
   */
  public static getClient(): Amity.Client | null {
    return AmityUIKitManager.instance?.client || null;
  }

  /**
   * Checks if the client is connected to the Amity SDK.
   * @returns True if the client is connected, false otherwise.
   */
  public isClientConnected(): boolean {
    return this.isConnected;
  }

  public static async syncNetworkConfig(): Promise<NetworkConfig> {
    try {
      const response = await AmityUIKitManager.instance?.client?.http.get(
        '/api/v3/network-settings/uikit',
        {
          headers: {
            'X-No-Cache': uuid(),
          },
        },
      );

      const networkConfig = response?.data;

      return networkConfig;
    } catch (e) {
      throw new Error('Network configuration sync failed');
    }
  }
}
