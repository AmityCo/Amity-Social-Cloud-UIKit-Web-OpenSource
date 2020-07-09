import React, { useEffect } from 'react';
import EkoClient, { ChannelRepository, _changeSDKDefaultConfig } from 'eko-sdk';

import ChatHome from './index';
import Chat from '../Chat';
import Message from '../Message';
import MessageList from '../MessageList';
import UiKitProvider from '../UiKitProvider';

export default {
  title: 'ChatHome',
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

// const CustomMessage = ({ data, type }) => <div>custom: {data.text}</div>;

const CustomMessage = props => (
  <div>
    original message with header
    <Message {...props} />
  </div>
);

export const ChatHomeWithoutCustomization = () => (
  <UiKitProvider>
    <ChatHome />
  </UiKitProvider>
);

export const WithGlobalProvider = () => (
  <UiKitProvider
    customComponents={{ Message: CustomMessage }}
    theme={
      {
        /*TODO*/
      }
    }
    localization={
      {
        /*TODO*/
      }
    }
  >
    <ChatHome />
  </UiKitProvider>
);

export const ChatHomeWithCustomization = () => (
  <UiKitProvider>
    <ChatHome customComponents={{ Message: CustomMessage }} />
  </UiKitProvider>
);

export const WithGlobalProviderOverride = () => (
  <UiKitProvider customComponents={{ Message: CustomMessage }} theme={{}}>
    <ChatHome customComponents={{ Message: null }} />
  </UiKitProvider>
);

const CustomMessageList = ({ messages }) => (
  <>
    customMessageList
    {messages.map(message => (
      <Message key={message._id} message={message} />
    ))}
  </>
);
export const MultyLayer = () => (
  <UiKitProvider customComponents={{ MessageList: CustomMessageList }} theme={{}}>
    <ChatHome />
  </UiKitProvider>
);

const CustomMessageWithMessageInside = props => (
  <div>
    <div>Custom Message, wrapping existing Message component</div>
    <Message {...props} />
  </div>
);

export const CustomWithReuseingOfOriginal = () => (
  <UiKitProvider customComponents={{ Message: CustomMessageWithMessageInside }} theme={{}}>
    <ChannelsPage />
  </UiKitProvider>
);

export const Example = () => <div>Example</div>;

export const JustUiComponent = () => (
  <UiKitProvider>
    <Channel channelId="intg-test-eNv4C5JRYQS7xADb1mHsCR" />
  </UiKitProvider>
);
