import React, { useCallback } from 'react';
import { AmityUIKitProvider } from '../../src/v4/core/providers';
import { Preview } from '@storybook/react';
import amityConfig from '../../amity-uikit.config.json';

export type AmityUIKitConfig = typeof amityConfig;

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
        {
          value: import.meta.env.STORYBOOK_USER1,
          title: import.meta.env.STORYBOOK_USER1?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER2,
          title: import.meta.env.STORYBOOK_USER2?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER3,
          title: import.meta.env.STORYBOOK_USER3?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER4,
          title: import.meta.env.STORYBOOK_USER4?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER5,
          title: import.meta.env.STORYBOOK_USER5?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER6,
          title: import.meta.env.STORYBOOK_USER6?.split(',')[1],
        },
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
      key={userId}
      userId={userId}
      displayName={displayName || userId}
      onConnectionStatusChange={handleConnectionStatusChange}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      configs={amityConfig}
    >
      {Story()}
    </AmityUIKitProvider>
  );
};

export default { global, decorator };
