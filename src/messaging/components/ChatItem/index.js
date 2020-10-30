import React from 'react';

import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';

import { Avatar, ChatItemContainer, UnreadCount } from './styles';

const ChatItem = ({ channel, selected, onSelect }) => (
  <ChatItemContainer onClick={() => onSelect(channel.channelId)} active={selected}>
    <Avatar backgroundImage={UserImage} />
    {channel.channelId}
    {!!channel.unreadCount && <UnreadCount>{channel.unreadCount}</UnreadCount>}
  </ChatItemContainer>
);

export default customizableComponent('ChatItem', ChatItem);
