import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { ChatHeader } from './';

export default {
  title: 'V4/ChatHeader',
};

const SampleChatHeader = () => {
  const { channels, hasMore, loadMore, isLoading } = useChannelsCollection({
    membership: 'all',
    sortBy: 'lastActivity',
    types: ['live'],
    limit: 1,
  });

  if (isLoading) return <div style={{ background: 'white', minWidth: '320px' }}>Loading...</div>;
  if (channels.length === 0)
    return <div style={{ background: 'white', minWidth: '320px' }}>No channels</div>;
  return (
    <div style={{ background: 'white', minWidth: '320px' }}>
      <ChatHeader channel={channels[0]} />
    </div>
  );
};

export const ChatHeaderStory = {
  render: () => <SampleChatHeader />,
  name: 'AmityChatHeader',
};
