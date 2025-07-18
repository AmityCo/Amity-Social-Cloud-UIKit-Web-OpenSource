import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { LivechatMessageComposer } from './LivechatMessageComposer';

export default {
  title: 'V4/LivechatMessageComposer',
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
      <LivechatMessageComposer channel={channels[0]} isJoined={true} />
    </div>
  );
};

export const MessageComposerStory = {
  render: () => <SampleMessageComposer />,
  name: 'MessageComposer',
};
