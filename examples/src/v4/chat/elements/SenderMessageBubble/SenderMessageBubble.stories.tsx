import React, { useRef } from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import useMessagesCollection from '~/chat/hooks/collections/useMessagesCollection';
import { SenderMessageBubble } from './SenderMessageBubble';

export default {
  title: 'V4/SenderMessageBubble',
};

const SampleMessageSenderView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { channels, isLoading: isLoadingChannel } = useChannelsCollection({
    membership: 'all',
    sortBy: 'lastActivity',
    types: ['live'],
    limit: 1,
  });

  const { messages, isLoading: isLoadingMessage } = useMessagesCollection({
    subChannelId: channels.length > 0 ? channels[0].defaultSubChannelId : '',
    limit: 1,
  });

  if (isLoadingChannel) return <div style={{ background: 'white' }}>Loading...</div>;
  if (channels.length === 0) return <div style={{ background: 'white' }}>No channels</div>;
  if (isLoadingMessage) return <div style={{ background: 'white' }}>Loading...</div>;
  if (messages.length === 0) return <div style={{ background: 'white' }}>No messages</div>;

  return (
    <div style={{ background: 'white' }}>
      <SenderMessageBubble containerRef={ref} message={messages[0]} action={{}} />
    </div>
  );
};

export const LiveChatStory = {
  render: () => <SampleMessageSenderView />,
  name: 'SenderMessageBubble',
};
