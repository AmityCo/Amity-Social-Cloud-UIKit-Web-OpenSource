import React from 'react';
import { ChannelRepository } from 'eko-sdk';

import { customizableComponent } from '../../hoks/customization';
import useLiveObject from '../../hooks/useLiveObject';

import {
  Avatar,
  ChatDetailsContainer,
  ChatDetailsHeader,
  CloseIcon,
  Channel,
  ChannelInfo,
  CommunityName,
  ChannelName,
} from './styles';

const channelRepo = new ChannelRepository();

const ChatDetails = ({ channelId, onClose }) => {
  const channel = useLiveObject(() => channelRepo.channelForId(channelId), {});
  return (
    <ChatDetailsContainer>
      <ChatDetailsHeader>
        Chat Detail
        <CloseIcon onClick={onClose} />
      </ChatDetailsHeader>
      <Channel>
        <Avatar />
        <ChannelInfo>
          <CommunityName>Community Name</CommunityName>
          <ChannelName>{channel.displayName || channel.channelId}</ChannelName>
        </ChannelInfo>
      </Channel>
    </ChatDetailsContainer>
  );
};

export default customizableComponent('ChatDetails')(ChatDetails);
