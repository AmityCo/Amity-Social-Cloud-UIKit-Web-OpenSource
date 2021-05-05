import React from 'react';
import { ChannelRepository } from '@amityco/js-sdk';

import customizableComponent from '~/core/hocs/customization';
import useLiveObject from '~/core/hooks/useLiveObject';
import { backgroundImage as UserImage } from '~/icons/User';

import {
  Avatar,
  ChatHeaderContainer,
  DetailsIcon,
  Channel,
  ChannelInfo,
  ChannelName,
  MemberCount,
} from './styles';

const channelRepo = new ChannelRepository();

const ChatHeader = ({ channelId, onChatDetailsClick }) => {
  const channel = useLiveObject(() => channelRepo.channelForId(channelId), [channelId]);

  return (
    <ChatHeaderContainer>
      <Channel>
        <Avatar backgroundImage={UserImage} />
        <ChannelInfo>
          <ChannelName>{channel.displayName || channel.channelId}</ChannelName>
          <MemberCount>{channel.memberCount} members</MemberCount>
        </ChannelInfo>
      </Channel>
      <DetailsIcon onClick={onChatDetailsClick} />
    </ChatHeaderContainer>
  );
};
export default customizableComponent('ChatHeader', ChatHeader);
