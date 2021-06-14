import React, { memo } from 'react';
import { ChannelRepository } from '@amityco/js-sdk';

import ChatItem from '~/messaging/components/ChatItem';
import customizableComponent from '~/core/hocs/customization';
import useLiveObject from '~/core/hooks/useLiveObject';
import CreateNewChat from './CreateNewChat';

import { RecentChatListContainer, RecentChatListHeader } from './styles';

const channelRepo = new ChannelRepository();

const RecentChat = ({ onChannelClick, selectedChannelId }) => {
  const channels = useLiveObject(() => channelRepo.allChannels(), []);

  return (
    <RecentChatListContainer>
      <RecentChatListHeader>
        Chats
        <CreateNewChat />
      </RecentChatListHeader>
      {Array.isArray(channels) &&
        channels.map(channel => (
          <ChatItem
            selected={selectedChannelId === channel.channelId}
            onSelect={onChannelClick}
            key={channel.channelId}
            channel={channel}
          />
        ))}
    </RecentChatListContainer>
  );
};

export default memo(customizableComponent('RecentChat', RecentChat));
