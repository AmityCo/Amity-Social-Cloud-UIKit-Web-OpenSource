import React, { useState, useEffect } from 'react';
import { MessageRepository, ChannelRepository } from '@amityco/js-sdk';

import MessageList from '~/chat/components/MessageList';
import MessageComposeBar from '~/chat/components/MessageComposeBar';
import customizableComponent from '~/core/hocs/customization';

import ChatHeader from '~/chat/components/ChatHeader';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();
const messageRepo = new MessageRepository();

const Chat = ({ channelId, channelType, onChatDetailsClick, shouldShowChatDetails }) => {
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const channelLiveObject = channelRepo.joinChannel({
      channelId,
      type: channelType,
    });

    channelLiveObject.on('dataUpdated', channelModel => {
      if (isReading) return;

      const membership = channelModel?.membership;
      if (!membership) return;

      membership.startReading();

      setIsReading(true);
    });

    return () => {
      if (!isReading) return;
      if (!channelLiveObject?.model?.membership) return;
      channelLiveObject.model.membership.stopReading();
      setIsReading(false);
    };
  }, [channelId]);

  const sendMessage = text => {
    messageRepo.createTextMessage({
      channelId,
      text,
    });
  };

  return (
    <ChannelContainer>
      <ChatHeader
        channelId={channelId}
        onChatDetailsClick={onChatDetailsClick}
        shouldShowChatDetails={shouldShowChatDetails}
      />
      <MessageList channelId={channelId} />
      <MessageComposeBar onSubmit={sendMessage} />
    </ChannelContainer>
  );
};

export default customizableComponent('Chat', Chat);
