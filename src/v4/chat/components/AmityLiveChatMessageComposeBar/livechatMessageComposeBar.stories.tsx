import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { AmityLiveChatMessageComposeBar } from '.';

export default {
  title: 'V4/AmityLiveChatMessageComposeBar',
};

const SampleLiveChatHeader = () => {
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
      <AmityLiveChatMessageComposeBar channel={channels[0]} composeAction={{}} />
    </div>
  );
};

export const LiveChatHeader = {
  render: () => <SampleLiveChatHeader />,
  name: 'AmityLiveChatMessageComposeBar',
};
