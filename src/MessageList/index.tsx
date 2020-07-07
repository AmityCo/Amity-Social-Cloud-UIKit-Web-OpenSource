import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { MessageRepository } from 'eko-sdk';
import Message from '../Message';

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
          {messages.map(message => (
            <Message key={message.messageId} {...message} />
          ))}
        </MessageListContainer>
      </InfiniteScroll>
    </InfiniteScrollContainer>
  );
};

export default customizableComponent('MessageList')(MessageList);
