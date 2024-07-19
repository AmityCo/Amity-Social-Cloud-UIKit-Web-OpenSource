import React, { useCallback } from 'react';
import { AmityUIKitProvider } from '../../src/v4/core/providers';
import { Preview } from '@storybook/react';
import amityConfig from '../../amity-uikit.config.json';
import { Config } from '../../src/v4/core/providers/CustomizationProvider';

const users = import.meta.env.STORYBOOK_USERS.split(',');

const GLOBAL_NAME = 'user';
const global = {
  [GLOBAL_NAME]: {
    name: 'User selector',
    description: 'User switcher for SDK',
    defaultValue: 'Web-Test',
    toolbar: {
      icon: 'user',
      items: [
        { value: 'Web-Test,Web-test', title: 'Web-Test' },
        ...users.map((user) => {
          return { value: `${user},${user}`, title: user };
        }),
      ],
    },
  },
};

const FALLBACK_USER = 'Web-Test,Web-Test';

const decorator: NonNullable<Preview['decorators']>[number] = (
  Story,
  { globals: { [GLOBAL_NAME]: val, theme } },
) => {
  const user = val || FALLBACK_USER;
  const [userId, displayName] = user.split(',');

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
      apiKey={import.meta.env.STORYBOOK_API_KEY}
      apiRegion={import.meta.env.STORYBOOK_API_REGION}
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
