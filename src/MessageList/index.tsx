import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { MessageRepository } from 'eko-sdk';
import IncomingMessage from '../Message/IncomingMessage';
import OutgoingMessage from '../Message/OutgoingMessage';

import { customizableComponent } from '../hoks/customization';
import usePaginatedLiveObject from '../hooks/usePaginatedLiveObject';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const messageRepo = new MessageRepository();

const MessageList = ({ channelId }) => {
  const [messages, hasMore, loadMore] = usePaginatedLiveObject(
    () => messageRepo.messagesForChannel({ channelId }),
    [],
  );

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
            const currentUserId = 'Web-Test'; // TODO
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

export default customizableComponent('MessageList')(MessageList);
