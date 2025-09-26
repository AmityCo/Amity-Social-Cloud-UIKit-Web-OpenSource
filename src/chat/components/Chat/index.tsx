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

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import { useChannelPermission } from '~/chat/hooks/useChannelPermission';
import useChannel from '~/chat/hooks/useChannel';

interface ChatProps {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
  onBackClick?: () => void;
}

const Chat = ({ channelId, onChatDetailsClick, shouldShowChatDetails, onBackClick }: ChatProps) => {
  useEffect(() => {
    return () => {
      SubChannelRepository.stopMessageReceiptSync(channelId);
    };
  }, [channelId]);

  const { isModerator } = useChannelPermission(channelId);
  const channel = useChannel(channelId);

  const sendMessage = async (text: string, mentions?: Amity.UserMention[]) => {
    const messageParams: any = {
      subChannelId: channelId,
      data: { text },
      dataType: 'text',
    };

    if (mentions && mentions.length > 0) {
      messageParams.mentionees = mentions;
    }

    return MessageRepository.createMessage(messageParams);
  };

  const renderMessageComposeBar = () => {
    if (channel?.type !== 'broadcast' || (channel?.type === 'broadcast' && isModerator)) {
      return <MessageComposeBar channelId={channelId} onSubmit={sendMessage} />;
    }
    return null;
  };

  return (
    <div className={styles.channelContainer}>
      <ChatHeader
        channelId={channelId}
        shouldShowChatDetails={shouldShowChatDetails}
        onChatDetailsClick={onChatDetailsClick}
        onBackClick={onBackClick}
      />
      <MessageList channelId={channelId} />
      {renderMessageComposeBar()}
    </div>
  );
};

export default (props: ChatProps) => {
  const CustomComponentFn = useCustomComponent<ChatProps>('Chat');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Chat {...props} />;
};
