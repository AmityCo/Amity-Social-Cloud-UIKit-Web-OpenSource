import React from 'react';
import { ChannelRepository } from 'eko-sdk';

import customizableComponent from '~/core/hocs/customization';
import useLiveObject from '~/core/hooks/useLiveObject';
import { backgroundImage as UserImage } from '~/icons/User';

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
  const channel = useLiveObject(() => channelRepo.channelForId(channelId), [channelId]);
  return (
    <ChatDetailsContainer>
      <ChatDetailsHeader>
        Chat Detail
        <CloseIcon onClick={onClose} />
      </ChatDetailsHeader>
      <Channel>
        <Avatar backgroundImage={UserImage} />
        <ChannelInfo>
          <CommunityName>Community Name</CommunityName>
          <ChannelName>{channel.displayName || channel.channelId}</ChannelName>
        </ChannelInfo>
      </Channel>
    </ChatDetailsContainer>
  );
};

export default customizableComponent('ChatDetails', ChatDetails);
