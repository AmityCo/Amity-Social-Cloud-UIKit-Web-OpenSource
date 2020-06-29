import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DefaultMessage from '../Message';
import { InfiniteScrollContainer, MessageListContainer } from './styles';

const MessagesList = ({ messages, hasMore, loadMore, Message = DefaultMessage }) => (
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

export default MessagesList;
