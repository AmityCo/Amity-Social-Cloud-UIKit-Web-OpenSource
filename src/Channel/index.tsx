import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import EkoClient, { MessageRepository, ChannelRepository, EkoChannelType } from 'eko-sdk';

import useLiveObject from '../hooks/useLiveObject';
import usePaginatedLiveObject from '../hooks/usePaginatedLiveObject';
import DefaultMessagesList from '../MessagesList';
import DefaultMessageComposeBar from '../MessageComposeBar';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();
const messageRepo = new MessageRepository();

const Channel = ({
  channelId,
  MessageComposeBar = DefaultMessageComposeBar,
  MessagesList = DefaultMessagesList,
}) => {
  const [messages, hasMore, loadMore] = usePaginatedLiveObject(
    () => messageRepo.messagesForChannel({ channelId }),
    [],
  );

  useEffect(() => {
    channelRepo.joinChannel({
      channelId,
      type: EkoChannelType.Standard,
    });
  }, []);

  const sendMessage = text => {
    const messageLiveObject = messageRepo.createTextMessage({
      channelId,
      text,
    });
  };

  return (
    <ChannelContainer>
      <MessagesList messages={messages} hasMore={hasMore} loadMore={loadMore} />
      <MessageComposeBar onSubmit={sendMessage} />
    </ChannelContainer>
  );
};

export default Channel;
