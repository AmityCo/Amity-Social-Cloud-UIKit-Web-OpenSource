import React from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import useMessagesCollection from '~/chat/hooks/collections/useMessagesCollection';
import { MessageBubble } from './MessageBubble';

export default {
  title: 'v4-chat/internal-components/MessageBubble',
};

const SampleMessageBubble = () => {
  const { channels, isLoading } = useChannelsCollection({
    membership: 'all',
    sortBy: 'lastActivity',
    types: ['live'],
    limit: 1,
  });

  const { messages } = useMessagesCollection({
    subChannelId: channels[0]?.channelId,
  });

  if (isLoading) return <div style={{ background: 'white', minWidth: '320px' }}>Loading...</div>;
  if (channels.length === 0 || messages.length === 0)
    return <div style={{ background: 'white', minWidth: '320px' }}>No channels / Messages</div>;
  return (
    <div
      style={{
        height: '100%',
        background: 'black',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'scroll',
        gap: '1rem',
        margin: 'auto',
        padding: '2rem 1rem',
      }}
    >
      {messages?.map((message) => <MessageBubble message={message as Amity.Message<'text'>} />)}
    </div>
  );
};

export const MessageBubbleStory = {
  render: () => <SampleMessageBubble />,
  name: 'MessageBubble',
};
