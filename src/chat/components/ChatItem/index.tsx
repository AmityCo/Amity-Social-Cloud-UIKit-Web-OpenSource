import React from 'react';

import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';
import UserAvatar from '~/chat/components/UserAvatar';
import SideMenuItem from '~/core/components/SideMenuItem';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useChannelSubscription from '~/social/hooks/useChannelSubscription';
import useChannel from '~/chat/hooks/useChannel';

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
  const normalizedUnreadCount = getNormalizedUnreadCount(channel?.unreadCount || 0);

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
        <div className={styles.title}>{chatName}</div>
      </div>
      {normalizedUnreadCount && (
        <div className={styles.unreadCount} data-testid="chat-item-unread-count">
          {normalizedUnreadCount}
        </div>
      )}
    </SideMenuItem>
  );
};

export default (props: ChatItemProps) => {
  const CustomComponentFn = useCustomComponent<ChatItemProps>('ChatItem');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatItem {...props} />;
};
