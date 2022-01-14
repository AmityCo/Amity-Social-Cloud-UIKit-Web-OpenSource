import React from 'react';

import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';

import { ChatItemLeft, Title, Avatar, ChatItemContainer, UnreadCount } from './styles';

function getNormalizedUnreadCount(channelUnreadCount) {
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

const ChatItem = ({ channel, isSelected, onSelect }) => {
  const { chatName, chatAvatar } = useChatInfo({ channel });

  const handleChatItemClick = (e) => {
    e.stopPropagation();
    onSelect({ channelId: channel.channelId, channelType: channel.type });
  };

  const normalizedUnreadCount = getNormalizedUnreadCount(channel.unreadCount);

  return (
    <ChatItemContainer active={isSelected} title={chatName} onClick={handleChatItemClick}>
      <ChatItemLeft>
        <Avatar
          avatarUrl={chatAvatar}
          defaultImage={channel.memberCount > 2 ? communityBackgroundImage : userBackgroundImage}
        />
        <Title>{chatName}</Title>
      </ChatItemLeft>
      {normalizedUnreadCount && <UnreadCount>{normalizedUnreadCount}</UnreadCount>}
    </ChatItemContainer>
  );
};

export default customizableComponent('ChatItem', ChatItem);
