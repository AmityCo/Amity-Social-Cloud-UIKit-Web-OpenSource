import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { MessageRepository } from 'eko-sdk';

import OutgoingMessage from '~/messaging/components/Message/OutgoingMessage';
import IncomingMessage from '~/messaging/components/Message/IncomingMessage';
import { customizableComponent } from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import useLiveCollection from '~/core/hooks/useLiveCollection';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const messageRepo = new MessageRepository();

const MessageList = ({ client, channelId }) => {
  const [messages, hasMore, loadMore] = useLiveCollection(
    () => messageRepo.messagesForChannel({ channelId }),
    [channelId],
  );

  const { currentUserId } = client;

  return (
    <InfiniteScrollContainer>
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={loadMore}
        useWindow={false}
        loader={<span key={0}>Loading</span>}
        isReverse
      >
        <MessageListContainer>
          {messages.map((message, i) => {
            const nextMessage = messages[i + 1];
            const consequent = nextMessage && nextMessage.userId === message.userId;
            const outgoing = message.userId === currentUserId;
            const MessageComponent = outgoing ? OutgoingMessage : IncomingMessage;
            return (
              <MessageComponent key={message.messageId} message={message} consequent={consequent} />
            );
          })}
        </MessageListContainer>
      </InfiniteScroll>
    </InfiniteScrollContainer>
  );
};

export default withSDK(customizableComponent('MessageList', MessageList));
