import React from 'react';

import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';

import { ChatItemLeft, Title, Avatar, ChatItemContainer, UnreadCount } from './styles';
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
  channel?: Amity.Channel;
  isSelected: boolean;
  onSelect: ({ channelId, type }: { channelId: string; type: string }) => void;
}

const ChatItem = ({ channel, isSelected, onSelect }: ChatItemProps) => {
  const { chatName, chatAvatar } = useChatInfo({ channel: channel || null });

  const normalizedUnreadCount = getNormalizedUnreadCount(channel?.unreadCount || 0);

  return (
    <ChatItemContainer
      data-qa-anchor="chat-item"
      active={isSelected}
      onClick={(e) => {
        e.stopPropagation();
        if (channel) onSelect({ channelId: channel.channelId, type: channel.type });
      }}
    >
      <ChatItemLeft>
        <Avatar
          avatarUrl={chatAvatar}
          defaultImage={
            (channel?.memberCount || 0) > 2 ? communityBackgroundImage : userBackgroundImage
          }
        />
        <Title>{chatName}</Title>
      </ChatItemLeft>
      {normalizedUnreadCount && (
        <UnreadCount data-qa-anchor="chat-item-unread-count">{normalizedUnreadCount}</UnreadCount>
      )}
    </ChatItemContainer>
  );
};

export default (props: ChatItemProps) => {
  const CustomComponentFn = useCustomComponent<ChatItemProps>('ChatItem');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatItem {...props} />;
};
