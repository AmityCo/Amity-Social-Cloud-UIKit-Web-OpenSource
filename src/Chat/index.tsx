import React, { useState, useEffect } from 'react';
import { MessageRepository, ChannelRepository, EkoChannelType } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';

import ChatHeader from '../ChatHeader';
import MessageList from '../MessageList';
import MessageComposeBar from '../MessageComposeBar';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();
const messageRepo = new MessageRepository();

const Chat = ({ channelId, onChatDetailsClick }) => {
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
      <ChatHeader channelId={channelId} onChatDetailsClick={onChatDetailsClick} />
      <MessageList channelId={channelId} />
      <MessageComposeBar onSubmit={sendMessage} />
    </ChannelContainer>
  );
};

export default customizableComponent('Chat')(Chat);
