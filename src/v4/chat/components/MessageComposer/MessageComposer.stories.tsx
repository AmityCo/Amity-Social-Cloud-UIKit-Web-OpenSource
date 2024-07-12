import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { MessageComposer } from './MessageComposer';

export default {
  title: 'V4/MessageComposer',
};

const SampleMessageComposer = () => {
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
      <MessageComposer channel={channels[0]} composeAction={{}} />
    </div>
  );
};

export const MessageComposerStory = {
  render: () => <SampleMessageComposer />,
  name: 'MessageComposer',
};
