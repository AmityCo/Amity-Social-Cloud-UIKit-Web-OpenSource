import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import useChatInfo from '~/chat/hooks/useChatInfo';
import useChannel from '~/chat/hooks/useChannel';
import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';

import ChatDetailsControls from './ChatDetailsControls';
import ChatDetailsMembers from './ChatDetailsMembers';

import {
  ChatDetailsContainer,
  ChatDetailsHeader,
  HeaderCloseIcon,
  ChatDetailsTitle,
  TitleInfo,
  TitleInfoLabel,
  TitleInfoChatName,
} from './styles';

const ChatDetails = ({ channelId, onClose, leaveChat, onEditChatMemberClick, onMemberSelect }) => {
  const channel = useChannel(channelId);
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const [shouldShowMembers, setShouldShowMembers] = useState(false);

  return (
    <ChatDetailsContainer>
      <ChatDetailsHeader>
        <FormattedMessage id="chat.details.header" />
        <HeaderCloseIcon onClick={onClose} />
      </ChatDetailsHeader>

      <ChatDetailsTitle>
        <UserAvatar avatarUrl={chatAvatar} defaultImage={communityBackgroundImage} />
        <TitleInfo>
          <TitleInfoLabel>
            <FormattedMessage id="chat.details.chatName" />
          </TitleInfoLabel>
          <TitleInfoChatName>{chatName}</TitleInfoChatName>
        </TitleInfo>
      </ChatDetailsTitle>

      {shouldShowMembers ? (
        <ChatDetailsMembers
          channelId={channelId}
          hideMembers={() => setShouldShowMembers(false)}
          onMemberSelect={onMemberSelect}
          onEditChatMemberClick={onEditChatMemberClick}
        />
      ) : (
        <ChatDetailsControls
          channelId={channelId}
          chatName={chatName}
          leaveChat={leaveChat}
          memberCount={channel.memberCount}
          showMembers={() => setShouldShowMembers(true)}
        />
      )}
    </ChatDetailsContainer>
  );
};

export default customizableComponent('ChatDetails', ChatDetails);
