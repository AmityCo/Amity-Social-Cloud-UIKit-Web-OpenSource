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
import { useChannelPermission } from '~/chat/hooks/useChannelPermission';
import useChannel from '~/chat/hooks/useChannel';

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

  const { isModerator } = useChannelPermission(channelId);
  const channel = useChannel(channelId);

  const sendMessage = async (text: string) => {
    return MessageRepository.createMessage({
      subChannelId: channelId,
      data: { text },
      dataType: 'text',
    });
  };

  const renderMessageComposeBar = () => {
    if (channel?.type !== 'broadcast' || (channel?.type === 'broadcast' && isModerator)) {
      return <MessageComposeBar onSubmit={sendMessage} />;
    }
    return null;
  };

  return (
    <ChannelContainer>
      <ChatHeader
        channelId={channelId}
        shouldShowChatDetails={shouldShowChatDetails}
        onChatDetailsClick={onChatDetailsClick}
      />
      <MessageList channelId={channelId} />
      {renderMessageComposeBar()}
    </ChannelContainer>
  );
};

export default (props: ChatProps) => {
  const CustomComponentFn = useCustomComponent<ChatProps>('Chat');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Chat {...props} />;
};
