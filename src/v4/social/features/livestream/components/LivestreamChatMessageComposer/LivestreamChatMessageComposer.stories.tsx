import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { LivestreamChatMessageComposer } from './LivestreamChatMessageComposer';

export default {
  title: 'V4/LivestreamChatMessageComposer',
};

const SampleMessageComposer = () => {
  const { channels, isLoading } = useChannelsCollection({
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
      <LivestreamChatMessageComposer channelId={channels[0].channelId} />
    </div>
  );
};

export const MessageComposerStory = {
  render: () => <SampleMessageComposer />,
  name: 'LivestreamChatMessageComposer',
};
