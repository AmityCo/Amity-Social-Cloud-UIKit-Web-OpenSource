import { Client as ASCClient } from '@amityco/ts-sdk';

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
 * Manages the Amity SDK client and authentication state.
 */
class AmityUIKitManager {
  private static instance: AmityUIKitManager | null = null;
  private client: Amity.Client | null = null;
  private isConnected: boolean = false;
  private stateChangeHandler: (() => void) | null = null;
  private disconnectedHandler: (() => void) | null = null;
  private onConnectionStatusChange?: (state: Amity.SessionStates) => void;
  private onConnected?: () => void;
  private onDisconnected?: () => void;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {}

  /**
   * Sets up the AmityUIKitManager instance with the provided configuration.
   * @param config - The configuration object containing the API key and endpoint.
   */
  public static setup(config: { apiKey: string; endpoint: string }): void {
    if (!AmityUIKitManager.instance) {
      AmityUIKitManager.instance = new AmityUIKitManager();
      const client: Amity.Client = ASCClient.createClient(config.apiKey, config.endpoint);
      AmityUIKitManager.setClient(client);
    }
  }

  /**
   * Registers a device with the Amity SDK and handles the login process.
   * @param userId - The user ID to be used for login.
   * @param displayName - The display name of the user.
   * @param sessionHandler - The session handler for access token renewal.
   * @param onConnectionStatusChange - The callback function for connection status changes.
   * @param onConnected - The callback function to be called when connected.
   * @param onDisconnected - The callback function to be called when disconnected.
   */
  public static async registerDevice(
    userId: string,
    displayName: string,
    sessionHandler: SessionHandler,
    onConnectionStatusChange?: (state: Amity.SessionStates) => void,
    onConnected?: () => void,
    onDisconnected?: () => void,
  ): Promise<void> {
    if (!AmityUIKitManager.instance) {
      throw new Error('AmityUIKitManager must be set up first using the setup method.');
    }

    AmityUIKitManager.instance.onConnectionStatusChange = onConnectionStatusChange;
    AmityUIKitManager.instance.onConnected = onConnected;
    AmityUIKitManager.instance.onDisconnected = onDisconnected;

    await AmityUIKitManager.instance.connectAndLogin(userId, displayName, sessionHandler);
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
  private async connectAndLogin(
    userId: string,
    displayName: string,
    sessionHandler: SessionHandler,
  ): Promise<void> {
    await ASCClient.login(
      { userId, displayName },
      {
        sessionWillRenewAccessToken:
          sessionHandler.sessionWillRenewAccessToken.bind(sessionHandler),
      },
    );

    this.stateChangeHandler = ASCClient.onSessionStateChange((state: Amity.SessionStates) => {
      this.onConnectionStatusChange?.(state);
    });

    this.disconnectedHandler = ASCClient.onClientDisconnected(() => {
      this.onDisconnected && this.onDisconnected();
    });

    this.onConnected && this.onConnected();
  }

  /**
   * Disconnects from the Amity SDK and cleans up resources.
   */
  public disconnect(): void {
    this.stateChangeHandler?.();
    this.disconnectedHandler?.();
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
}

export default AmityUIKitManager;
