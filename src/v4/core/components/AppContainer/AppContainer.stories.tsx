import React from 'react';
import { AppContainer } from './AppContainer';
import UiKitSocialApplication from '~/v4/social/pages/Application';
import ChatApplication from '~/chat/pages/Application';

export default {
  title: 'V4/AppContainer',
};

export const AppContainerStory = {
  render: () => {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <AppContainer
          socialComponent={<UiKitSocialApplication />}
          chatComponent={<ChatApplication defaultChannelId={null} />}
          defaultTab="community"
        />
      </div>
    );
  },
  name: 'App with NavBar and TopBar',
};

export const AppContainerChatStory = {
  render: () => {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <AppContainer
          socialComponent={<UiKitSocialApplication />}
          chatComponent={<ChatApplication defaultChannelId={null} />}
          defaultTab="chat"
          chatBadgeCount={99}
        />
      </div>
    );
  },
  name: 'App with Chat Active',
};
