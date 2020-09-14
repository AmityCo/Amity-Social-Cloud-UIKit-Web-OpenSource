import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageRepository } from 'eko-sdk';

import { customizableComponent } from 'hocs/customization';
import withSDK from 'hocs/withSDK';
import useLiveCollection from 'hooks/useLiveCollection';
import OutgoingMessage from 'components/Message/OutgoingMessage';
import IncomingMessage from 'components/Message/IncomingMessage';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const messageRepo = new MessageRepository();

const MessageList = ({ client, channelId }) => {
  const [messages, hasMore, loadMore] = useLiveCollection(
    () => messageRepo.messagesForChannel({ channelId }),
    [],
  );

  const { currentUserId } = client;

  return (
    <InfiniteScrollContainer>
      <InfiniteScroll
        hasMore={hasMore}
        next={loadMore}
        dataLength={messages.length}
        loader={<span key={0}>Loading</span>}
        inverse
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
