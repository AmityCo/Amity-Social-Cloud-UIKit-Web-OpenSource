import React from 'react';

import { customizableComponent } from 'hocs/customization';

import { Avatar, ChatItemContainer, UnreadCount } from './styles';

const ChatItem = ({ channel, selected, onSelect }) => (
  <ChatItemContainer onClick={() => onSelect(channel.channelId)} active={selected}>
    <Avatar />
    {channel.channelId}
    {!!channel.unreadCount && <UnreadCount>{channel.unreadCount}</UnreadCount>}
  </ChatItemContainer>
);

export default customizableComponent('ChatItem', ChatItem);
