import React, { useCallback } from 'react';
import { AmityUIKitProvider } from '../../src/v4/core/providers';
import { Preview } from '@storybook/react';
import amityConfig from '../../amity-uikit.config.json';
import { Config } from '../../src/v4/core/providers/CustomizationProvider';
import { useState } from 'react';
import { useEffect } from 'react';

type AuthSignatureResponse = {
  signature: string;
  input?: {
    deviceId: string;
    authSignatureExpiresAt: string;
    dataToSign: string;
  };
};

const FALLBACK_USER = 'Web-Test';

const decorator: NonNullable<Preview['decorators']>[number] = (Story, context) => {
  const { args } = context;

  const currentUserId =
    !args.userType || args.userType === 'signed-in' ? args.userId || FALLBACK_USER : undefined;

  const [userId, setUserId] = useState<string | undefined>(currentUserId);

  const [displayNameState, setDisplayNameState] = useState<string | undefined>(
    args.displayName || args.userId || userId,
  );

  if (args.visitorCanViewClip) {
    amityConfig.feature_flags.post.clip.can_view_tab = 'all';
  }

  const authSignatureExpiresAt =
    args.authSignatureExpiresAt && args.userType === 'visitor'
      ? new Date(args.authSignatureExpiresAt)?.toISOString()
      : undefined;

  const [config, setConfig] = useState<Config>(amityConfig as any);

  useEffect(() => {
    if (!args.submit) return;
    if (args.userId) {
      setUserId(args.userId);
    }
    if (args.displayName) {
      setDisplayNameState(args.displayName);
    }
  }, [args.submit]);

  const displayName = displayNameState || userId;

  const handleConnectionStatusChange = useCallback((...args) => {
    console.log(`[UiKitProvider.handleConnectionStatusChange]`, ...args);
  }, []);

  const handleConnected = useCallback((...args) => {
    console.log(`[UiKitProvider.handleConnected]`, ...args);
  }, []);

  const handleDisconnected = useCallback((...args) => {
    console.log(`[UiKitProvider.handleDisconnected]`, ...args);
  }, []);

  useEffect(() => {
    if (args.theme) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        preferred_theme: args.theme,
      }));
    }
  }, [args.theme]);

  const getAuthSignature = async ({
    deviceId,
    authSignatureExpiresAt,
  }: {
    deviceId: string;
    authSignatureExpiresAt: string;
  }) => {
    const url =
      import.meta.env.STORYBOOK_VISITOR_AUTH_SIGNATURE_URL! +
      `/?deviceId=${encodeURIComponent(deviceId)}&authSignatureExpiresAt=${encodeURIComponent(authSignatureExpiresAt)}`;

    const response = await fetch(url);
    const responseJson = (await response.json()) as AuthSignatureResponse;

    return responseJson.signature;
  };

  return (
    <AmityUIKitProvider
      apiKey={args.apiKey || import.meta.env.STORYBOOK_API_KEY}
      apiRegion={args.apiRegion || import.meta.env.STORYBOOK_API_REGION}
      key={userId}
      userId={userId}
      displayName={displayName || userId}
      onConnectionStatusChange={handleConnectionStatusChange}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      configs={config as Config}
      syncNetworkConfig={args.syncNetworkConfig}
      isBotUser={args.userType === 'bot'}
      authSignatureExpiresAt={authSignatureExpiresAt}
      getAuthSignature={args.secureMode ? getAuthSignature : undefined}
    >
      <Story />
    </AmityUIKitProvider>
  );
};

export default { global, decorator };
