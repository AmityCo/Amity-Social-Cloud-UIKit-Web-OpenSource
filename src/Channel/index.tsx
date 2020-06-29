import React, { useState, useEffect } from 'react';
import { MessageRepository, ChannelRepository, EkoChannelType } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import usePaginatedLiveObject from '../hooks/usePaginatedLiveObject';

import MessageList from '../MessageList';
import MessageComposeBar from '../MessageComposeBar';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();
const messageRepo = new MessageRepository();

const Channel = ({ channelId }) => {
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
      <MessageList messages={messages} hasMore={hasMore} loadMore={loadMore} />
      <MessageComposeBar onSubmit={sendMessage} />
    </ChannelContainer>
  );
};

export default customizableComponent('Channel')(Channel);
