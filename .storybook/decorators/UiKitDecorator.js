import React, { useState, useRef } from 'react';
import UiKitProvider from '../../src/core/providers/UiKitProvider';
import MockData from '~/mock';

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
          value: 'Web-Test,Web-test',
          title: 'Web-Test',
        },
        {
          value: process.env.STORYBOOK_USER1,
          title: process.env.STORYBOOK_USER1.split(',')[1],
        },
        {
          value: process.env.STORYBOOK_USER2,
          title: process.env.STORYBOOK_USER2.split(',')[1],
        },
        {
          value: 'reconnect',
          title: '⚠️ Reconnect ⚠️',
        },
        {
          value: 'disconnect',
          title: '⚠️ Disconnect ⚠️',
        },
      ],
    },
  },
};

const FALLBACK_USER = 'Web-Test,Web-Test';

const decorator = (Story, { globals: { [GLOBAL_NAME]: val } }) => {
  const user = val || FALLBACK_USER;
  const [userId, displayName] = user.split(',');

  const ref = useRef();

  console.log('-------------------', val);

  if (ref?.current) {
    if (val === 'reconnect') ref.current.reconnect();
    else if (val === 'disconnect') ref.current.disconnect();
  }

  const handleConnectionStatusChange = (...args) => {
    console.log(`[UiKitProvider.handleConnectionStatusChange]`, ...args);
  };

  const handleConnected = (...args) => {
    console.log(`[UiKitProvider.handleConnected]`, ...args);
  };

  const handleDisconnected = (...args) => {
    console.log(`[UiKitProvider.handleDisconnected]`, ...args);
  };

  return (
    <UiKitProvider
      ref={ref}
      key={userId}
      apiKey={process.env.STORYBOOK_API_KEY}
      apiEndpoint={process.env.STORYBOOK_API_ENDPOINT}
      userId={userId}
      displayName={displayName || userId}
      onConnectionStatusChange={handleConnectionStatusChange}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
    >
      <MockData>
        <Story />
      </MockData>
    </UiKitProvider>
  );
};

export default {
  global,
  decorator,
};
