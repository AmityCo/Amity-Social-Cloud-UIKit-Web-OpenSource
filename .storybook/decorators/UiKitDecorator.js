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
      items: [{
        value: 'Web-Test,Web-test',
        title: 'Web-Test',
      }, {
        value: process.env.STORYBOOK_USER1,
        title: process.env.STORYBOOK_USER1.split(',')[1],
      }, {
        value: process.env.STORYBOOK_USER2,
        title: process.env.STORYBOOK_USER2.split(',')[1],
      }],
    },
  }
}

_changeSDKDefaultConfig({
  ws: { endpoint: process.env.STORYBOOK_API_ENDPOINT },
  http: { endpoint: process.env.STORYBOOK_API_ENDPOINT },
});

const FALLBACK_USER = 'Web-Test,Web-Test'

const decorator = (Story, { globals: { [GLOBAL_NAME]: val } }) => {
  const user = val || FALLBACK_USER
  const [userId, displayName] = user.split(',')

  return (<UiKitProvider
    key={userId}
    apiKey={process.env.STORYBOOK_API_KEY}
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
