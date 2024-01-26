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
import useChannel from '~/chat/hooks/useChannel';
import useChannelMembers from '~/chat/hooks/useChannelMembers';

interface ChatProps {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
}

const Chat = ({ channelId, onChatDetailsClick, shouldShowChatDetails }: ChatProps) => {
  const channel = useChannel(channelId);
  useEffect(() => {
    async function run() {
      if (channel == null) return;

      if (channel.type !== 'conversation') {
        await ChannelRepository.joinChannel(channel?.channelId);
      }

      await SubChannelRepository.startReading(channel?.channelId);
    }
    run();
    return () => {
      if (channel == null) return;
      SubChannelRepository.stopReading(channel?.channelId);
    };
  }, [channel]);

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
