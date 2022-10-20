import React, { useEffect } from 'react';
import { MessageRepository, ChannelRepository } from '@amityco/js-sdk';

import MessageList from '~/chat/components/MessageList';
import MessageComposeBar from '~/chat/components/MessageComposeBar';
import customizableComponent from '~/core/hocs/customization';

import ChatHeader from '~/chat/components/ChatHeader';

import { ChannelContainer } from './styles';

const channelRepo = new ChannelRepository();

const Chat = ({ channelId, onChatDetailsClick, shouldShowChatDetails }) => {
  useEffect(() => {
    const channelLiveObject = channelRepo.joinChannel({ channelId });

    // TODO call startReading once on join, everytime a new message is received and a message list is scrolled to very bottom
    if (channelLiveObject.model?.membership) {
      channelLiveObject.model.membership.startReading();
    }

    channelLiveObject.on('dataUpdated', (channelModel) => {
      if (!channelModel?.membership) {
        return;
      }

      channelModel.membership.startReading();
    });

    return () => {
      if (channelLiveObject?.model?.membership) {
        channelLiveObject.model.membership.stopReading();
      }

      channelLiveObject.dispose();
    };
  }, [channelId]);

  const sendMessage = (text) => {
    MessageRepository.createTextMessage({
      channelId,
      text,
    });
  };

  return (
    <ChannelContainer>
      <ChatHeader
        channelId={channelId}
        shouldShowChatDetails={shouldShowChatDetails}
        onChatDetailsClick={onChatDetailsClick}
      />
      <MessageList channelId={channelId} />
      <MessageComposeBar onSubmit={sendMessage} />
    </ChannelContainer>
  );
};

export default customizableComponent('Chat', Chat);
