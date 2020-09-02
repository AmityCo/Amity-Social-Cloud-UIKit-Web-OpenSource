import React from 'react';
import ChatHome from '.';
import Message from '../Message';

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
