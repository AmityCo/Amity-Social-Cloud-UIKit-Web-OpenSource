import React from 'react';

import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';
import UserAvatar from '~/chat/components/UserAvatar';
import SideMenuItem from '~/core/components/SideMenuItem';
import { useChannelLastMessage } from '~/chat/hooks/useChannelLastMessage';
import { formatChatTimestamp, truncateMessage } from '~/chat/utils/chatTimestamp';
import useSDK from '~/core/hooks/useSDK';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

function getNormalizedUnreadCount(channelUnreadCount: number) {
  // Within this range the unread counter will show an actuall number
  const ACTUAL_NUMBER_AS_COUNTER_EDGES = {
    BOTTOM: 1,
    TOP: 99,
  };

  if (!channelUnreadCount) return '';

  if (channelUnreadCount < ACTUAL_NUMBER_AS_COUNTER_EDGES.BOTTOM) return '';

  if (channelUnreadCount <= ACTUAL_NUMBER_AS_COUNTER_EDGES.TOP) return channelUnreadCount;

  return `${ACTUAL_NUMBER_AS_COUNTER_EDGES.TOP}+`;
}

interface ChatItemProps {
  channel: Amity.Channel;
  isSelected: boolean;
  onSelect: ({ channelId, type }: { channelId: string; type: Amity.ChannelType }) => void;
}

const ChatItem = ({ channel, isSelected, onSelect }: ChatItemProps) => {
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const { currentUserId } = useSDK();
  const { lastMessage } = useChannelLastMessage(channel?.channelId);

  const normalizedUnreadCount = getNormalizedUnreadCount(channel?.unreadCount || 0);

  const getLastMessagePreview = () => {
    if (!lastMessage) return '';

    const messageText = lastMessage.data?.text || '';
    const isOwnMessage = lastMessage.creatorId === currentUserId;

    if (isOwnMessage) {
      return `Tu: ${truncateMessage(messageText, 50)}`;
    }

    return truncateMessage(messageText, 60);
  };

  const getTimestamp = () => {
    if (lastMessage?.createdAt) {
      return formatChatTimestamp(lastMessage.createdAt);
    }
    if (channel?.updatedAt) {
      return formatChatTimestamp(channel.updatedAt);
    }
    return '';
  };

  return (
    <SideMenuItem
      className={styles.chatItemContainer}
      data-testid="chat-item"
      active={isSelected}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (channel) onSelect({ channelId: channel.channelId, type: channel.type });
      }}
    >
      <div className={styles.chatItemLeft}>
        <div className={styles.avatar}>
          <UserAvatar
            avatarUrl={chatAvatar}
            defaultImage={
              (channel?.memberCount || 0) > 2 ? communityBackgroundImage : userBackgroundImage
            }
          />
        </div>
        <div className={styles.chatContent}>
          <div className={styles.chatHeader}>
            <div className={styles.title}>{chatName}</div>
          </div>
          {getLastMessagePreview() && (
            <div className={styles.lastMessage}>{getLastMessagePreview()}</div>
          )}
        </div>
      </div>
      <div className={styles.rightSide}>
        {getTimestamp() && <div className={styles.timestamp}>{getTimestamp()}</div>}
        {normalizedUnreadCount && (
          <div className={styles.unreadBadge} data-testid="chat-item-unread-count">
            {normalizedUnreadCount}
          </div>
        )}
      </div>
    </SideMenuItem>
  );
};

export default (props: ChatItemProps) => {
  const CustomComponentFn = useCustomComponent<ChatItemProps>('ChatItem');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatItem {...props} />;
};
