import React, { useRef } from 'react';
import UiKitProvider from '../../src/core/providers/UiKitProvider';
import MockData from '~/mock';

import { ThemeProvider, extendCompassTheme, CompassColor } from '@noom/wax-component-library';

const GLOBAL_NAME = 'user';

const theme = {
  palette: {
    primary: CompassColor.tarocco,
    secondary: CompassColor.white,
    alert: CompassColor.yolk,
    highlight: CompassColor.tarocco,
    background: '#F6F4EE',
    neutral: CompassColor.black,
  },
  typography: {
    global: {
      fontFamily: 'Untitled Sans, Arial',
      fontStyle: 'normal',
      fontWeight: 400,
    },
    bodyBold: {
      fontWeight: 500,
    },
  },
};

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

const compassTheme = extendCompassTheme({
  shadows: {
    outline: `0 0 0 2px ${CompassColor.tarocco}`,
  },
});

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
    <ThemeProvider theme={compassTheme} resetCSS>
      <UiKitProvider
        ref={ref}
        key={userId}
        theme={theme}
        apiKey={process.env.STORYBOOK_API_KEY}
        apiRegion={process.env.STORYBOOK_API_REGION}
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
    </ThemeProvider>
  );
};

export default {
  global,
  decorator,
};
