import React, { useEffect } from 'react';
import {
  MessageRepository,
  ChannelRepository,
  SubChannelRepository,
  CommunityRepository,
} from '@amityco/ts-sdk';

import MessageList from '~/chat/components/MessageList';
import MessageComposeBar from '~/chat/components/MessageComposeBar';

import ChatHeader from '~/chat/components/ChatHeader';

import { ChannelContainer } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface ChatProps {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
}

const Chat = ({ channelId, onChatDetailsClick, shouldShowChatDetails }: ChatProps) => {
  useEffect(() => {
    return () => {
      SubChannelRepository.stopReading(channelId);
    };
  }, [channelId]);

  const sendMessage = async (text: string) => {
    return MessageRepository.createMessage({
      subChannelId: channelId,
      data: { text },
      dataType: 'text',
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

export default (props: ChatProps) => {
  const CustomComponentFn = useCustomComponent<ChatProps>('Chat');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Chat {...props} />;
};
