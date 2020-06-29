import React, { useEffect } from 'react';
import EkoClient, { ChannelRepository, _changeSDKDefaultConfig } from 'eko-sdk';

import ChannelsPage from './index';
import Channel from '../Channel';
import Message from '../Message';
import MessageList from '../MessageList';
import UiKitProvider from '../UiKitProvider';

export default {
  title: 'ChannelsPage',
};

_changeSDKDefaultConfig({
  ws: { endpoint: 'https://api.staging.ekomedia.technology' },
  http: { endpoint: 'https://api.staging.ekomedia.technology' },
});

// TODO do only once
try {
  // Connect to EkoClient with apiKey
  const client = new EkoClient({ apiKey: 'b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b' });
  // Register Session with EkoClient with userId and display name
  client.registerSession({
    userId: 'Web-Test',
    displayName: 'Web-Test',
  });
} catch (e) {
  console.log(e);
}

const CustomMessage = ({ data, type }) => <div>custom: {data.text}</div>;

export const ChannelsPageWithoutCustomization = () => <ChannelsPage />;

export const ChannelsPageWithCustomization = () => (
  <ChannelsPage customComponents={{ Message: CustomMessage }} />
);

export const WithGlobalProvider = () => (
  <UiKitProvider customComponents={{ Message: CustomMessage }} theme={{}}>
    <ChannelsPage />
  </UiKitProvider>
);

export const WithGlobalProviderOverride = () => (
  <UiKitProvider customComponents={{ Message: CustomMessage }} theme={{}}>
    <ChannelsPage customComponents={{ Message: null }} />
  </UiKitProvider>
);

const CustomMessageList = ({ messages }) => (
  <>
    customMessageList
    {messages.map(Message)}
  </>
);

export const MultyLayer = () => (
  <UiKitProvider customComponents={{ MessageList: CustomMessageList }} theme={{}}>
    <ChannelsPage />
  </UiKitProvider>
);

export const JustUiComponent = () => <Channel channelId="intg-test-eNv4C5JRYQS7xADb1mHsCR" />;
