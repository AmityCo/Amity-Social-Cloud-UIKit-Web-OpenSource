import React from 'react';
import ChatLoadingState from './ChatLoadingState';
import ChatReadyState from './ChatReadyState';

const ChatContainer = ({ channel }: { channel: Amity.Channel | null }) => {
  if (!channel) return <ChatLoadingState />;
  return <ChatReadyState channel={channel} />;
};

export default ChatContainer;
