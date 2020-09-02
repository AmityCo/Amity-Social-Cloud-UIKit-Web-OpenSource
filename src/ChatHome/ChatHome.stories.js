import React, { useEffect } from 'react';
import ChatHome from '.';
import Chat from '../Chat';
import Message from '../Message';
import MessageList from '../MessageList';
import UiKitProvider from '../UiKitProvider';

export default {
  title: 'ChatHome',
};

// const CustomMessage = ({ data, type }) => <div>custom: {data.text}</div>;

const CustomMessage = props => (
  <div>
    original message with header
    <Message {...props} />
  </div>
);

export const ChatHomeWithoutCustomization = () => <ChatHome />;

export const ChatHomeWithCustomization = () => (
  <ChatHome customComponents={{ Message: CustomMessage }} />
);
