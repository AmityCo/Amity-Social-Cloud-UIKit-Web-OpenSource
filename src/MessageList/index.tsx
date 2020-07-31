import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { MessageRepository } from 'eko-sdk';
import IncomingMessage from '../Message/IncomingMessage';
import OutgoingMessage from '../Message/OutgoingMessage';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';
import usePaginatedLiveObject from '../hooks/usePaginatedLiveObject';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const messageRepo = new MessageRepository();

const MessageList = ({ client, channelId }) => {
  const [messages, hasMore, loadMore] = usePaginatedLiveObject(
    () => messageRepo.messagesForChannel({ channelId }),
    [],
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

export default withSDK(customizableComponent('MessageList')(MessageList));
