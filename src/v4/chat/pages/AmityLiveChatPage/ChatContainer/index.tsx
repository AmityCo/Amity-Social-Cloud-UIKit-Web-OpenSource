import React from 'react';
import ChatLoadingState from './ChatLoadingState';
import ChatReadyState from './ChatReadyState';

const ChatContainer = ({
  pageId = '*',
  channel,
}: {
  pageId?: string;
  channel: Amity.Channel | null;
}) => {
  if (!channel) return <ChatLoadingState />;
  return <ChatReadyState channel={channel} pageId={pageId} />;
};

export default ChatContainer;
