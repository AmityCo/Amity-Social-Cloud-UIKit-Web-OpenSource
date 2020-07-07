import React, { useState, useEffect } from 'react';
import { ChannelRepository } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import useLiveObject from '../hooks/useLiveObject';
import ChatItem from '../ChatItem';

import { ChannelsListContainer } from './styles';

const channelRepo = new ChannelRepository();

const RecentChat = ({ onChannelClick, selectedChannelId }) => {
  const channels = useLiveObject(() => channelRepo.allChannels(), []);

  return (
    <ChannelsListContainer>
      {channels.map(channel => (
        <ChatItem
          selected={selectedChannelId === channel.channelId}
          onSelect={onChannelClick}
          key={channel.channelId}
          {...channel}
        />
      ))}
    </ChannelsListContainer>
  );
};

export default customizableComponent('RecentChat')(RecentChat);
