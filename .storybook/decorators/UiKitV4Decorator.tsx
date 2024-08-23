import React, { useCallback } from 'react';
import { AmityUIKitProvider } from '../../src/v4/core/providers';
import { Preview } from '@storybook/react';
import amityConfig from '../../amity-uikit.config.json';
import { Config } from '../../src/v4/core/providers/CustomizationProvider';
import { useState } from 'react';
import { useEffect } from 'react';

const FALLBACK_USER = 'Web-Test';

const decorator: NonNullable<Preview['decorators']>[number] = (Story, context) => {
  const { args } = context;

  const [userId, setUserId] = useState<string>(args.userId || FALLBACK_USER);
  const [displayNameState, setDisplayNameState] = useState<string | undefined>(
    args.displayName || args.userId || userId,
  );

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
      configs={amityConfig as Config}
    >
      <Story />
    </AmityUIKitProvider>
  );
};

export default { global, decorator };
