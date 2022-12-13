import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ChannelRepository } from '@amityco/js-sdk';

import UserAvatar from '~/chat/components/UserAvatar';
import customizableComponent from '~/core/hocs/customization';
import useLiveObject from '~/core/hooks/useLiveObject';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';

import {
  ChatHeaderContainer,
  DetailsIcon,
  Channel,
  ChannelInfo,
  ChannelName,
  MemberCount,
} from './styles';

const ChatHeader = ({ channelId, onChatDetailsClick, shouldShowChatDetails }) => {
  const channel = useLiveObject(() => ChannelRepository.getChannel(channelId), [channelId]);
  const { chatName, chatAvatar } = useChatInfo({ channel });

  return (
    <ChatHeaderContainer data-qa-anchor="chat-header">
      <Channel>
        <UserAvatar
          avatarUrl={chatAvatar}
          defaultImage={channel.memberCount > 2 ? communityBackgroundImage : userBackgroundImage}
        />
        <ChannelInfo data-qa-anchor="chat-header-channel-info">
          <ChannelName data-qa-anchor="chat-header-channel-info-channel-name">
            {chatName}
          </ChannelName>
          <MemberCount data-qa-anchor="chat-header-channel-info-member-count">
            <FormattedMessage id="chat.members.count" values={{ count: channel.memberCount }} />
          </MemberCount>
        </ChannelInfo>
      </Channel>
      {!shouldShowChatDetails && <DetailsIcon onClick={onChatDetailsClick} />}
    </ChatHeaderContainer>
  );
};

export default customizableComponent('ChatHeader', ChatHeader);
