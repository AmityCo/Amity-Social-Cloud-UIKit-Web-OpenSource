import React, { useEffect } from 'react';
import { MessageRepository, ChannelRepository, ChannelType } from '@amityco/js-sdk';

import MessageList from '~/messaging/components/MessageList';
import MessageComposeBar from '~/messaging/components/MessageComposeBar';
import customizableComponent from '~/core/hocs/customization';

import ChatHeader from '~/messaging/components/ChatHeader';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();
const messageRepo = new MessageRepository();

const Chat = ({ channelId, onChatDetailsClick }) => {
  useEffect(() => {
    channelRepo.joinChannel({
      channelId,
      type: ChannelType.Standard,
    });
  }, []);

  const sendMessage = text => {
    messageRepo.createTextMessage({
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

export default customizableComponent('Chat', Chat);
