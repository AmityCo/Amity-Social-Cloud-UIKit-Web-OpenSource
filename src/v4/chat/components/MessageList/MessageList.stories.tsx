import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { MessageList } from './MessageList';

export default {
  title: 'V4/MessageList',
};

const SampleLiveChatMessageList = () => {
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
      <MessageList
        channel={channels[0]}
        replyMessage={(message) => console.log('reply', message)}
      />
    </div>
  );
};

export const LiveChatMessageList = {
  render: () => <SampleLiveChatMessageList />,
  name: 'MessageList',
};
