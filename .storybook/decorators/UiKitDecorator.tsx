import React, { useCallback, useEffect, useRef } from 'react';
import UiKitProvider from '../../src/core/providers/UiKitProvider';

import { Preview } from '@storybook/react';

const GLOBAL_NAME = 'user';

const global = {
  [GLOBAL_NAME]: {
    name: 'User selector',
    description: 'User switcher for SDK',
    defaultValue: 'Web-Test',
    toolbar: {
      icon: 'user',
      items: [
        {
          value: 'Web-Test,Web-Test',
          title: 'Web-Test',
        },
        {
          value: import.meta.env.STORYBOOK_USER1,
          title: import.meta.env.STORYBOOK_USER1?.split(',')[1],
        },
        {
          value: import.meta.env.STORYBOOK_USER2,
          title: import.meta.env.STORYBOOK_USER2?.split(',')[1],
        },
      ],
    },
  },
};

const FALLBACK_USER = 'Web-Test,Web-Test';

const apiKey = import.meta.env.STORYBOOK_API_KEY;
const apiRegion = import.meta.env.STORYBOOK_API_REGION;

const decorator: NonNullable<Preview['decorators']> = (
  Story,
  { globals: { [GLOBAL_NAME]: val } },
) => {
  const user = val || FALLBACK_USER;
  const [userId, displayName] = user.split(',');

  const ref = useRef<{ logout: () => void; login: () => Promise<void> } | null>(null);

  console.log('-------------------', val);

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
    ref.current?.logout();
    ref.current?.login();
  }, [userId]);

  return (
    <UiKitProvider
      key={userId}
      apiKey={apiKey}
      apiRegion={apiRegion}
      userId={userId}
      displayName={displayName || userId}
      onConnectionStatusChange={handleConnectionStatusChange}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
    >
      {Story()}
    </UiKitProvider>
  );
};

export default {
  global,
  decorator,
};
