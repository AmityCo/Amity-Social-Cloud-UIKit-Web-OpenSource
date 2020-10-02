import React from 'react';
import UiKitProvider from '../../src/core/providers/UiKitProvider';
import { _changeSDKDefaultConfig } from 'eko-sdk';

const GLOBAL_NAME = 'user'

const global = {
  [GLOBAL_NAME]: {
    name: 'User selector',
    description: 'User switcher for SDK',
    defaultValue: 'Web-Test',
    toolbar: {
      icon: 'user',
      items: ['Web-Test', 'ENV_USER1', 'ENV_USER2'],
    },
  }
}

_changeSDKDefaultConfig({
  ws: { endpoint: process.env.STORYBOOK_API_ENDPOINT },
  http: { endpoint: process.env.STORYBOOK_API_ENDPOINT },
});

const WEB_TEST_USER = 'Web-Test,Web-test'
const FALLBACK_USER = 'Web-Test,ENV_USER_NOT_SET'

const decorator = (Story, { globals: { [GLOBAL_NAME]: val } }) => {
  const user = val === 'Web-Test'
    ? WEB_TEST_USER  
    : process.env[`STORYBOOK_${val}`] || FALLBACK_USER

  const [userId,displayName] = user.split(',')

  return (<UiKitProvider
    key={userId}
    apiKey={process.env.STORYBOOK_SDK_API_KEY}
    userId={userId}
    displayName={displayName || userId}
  >
    <Story />
  </UiKitProvider>)
};

export default {
  global,
  decorator,
}
