import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

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
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface ChatDetailsProps {
  channelId: string;
  onClose?: () => void;
  leaveChat?: () => void;
  onEditChatMemberClick?: ({
    channel,
    members,
  }: {
    channel: Amity.Channel;
    members: Amity.Membership<'channel'>[];
  }) => void;
  onMemberSelect?: (member: Amity.Membership<'channel'>) => void;
}

const ChatDetails = ({
  channelId,
  onClose,
  leaveChat,
  onEditChatMemberClick,
  onMemberSelect,
}: ChatDetailsProps) => {
  const channel = useChannel(channelId);
  const { chatName, chatAvatar, type: chatType } = useChatInfo({ channel });
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
          onEditChatMemberClick={({ members }) =>
            channel && onEditChatMemberClick?.({ channel, members })
          }
        />
      ) : (
        <ChatDetailsControls
          chatType={chatType}
          channelId={channelId}
          chatName={chatName}
          leaveChat={leaveChat}
          memberCount={channel?.memberCount}
          showMembers={() => setShouldShowMembers(true)}
        />
      )}
    </ChatDetailsContainer>
  );
};

export default (props: ChatDetailsProps) => {
  const CustomComponentFn = useCustomComponent<ChatDetailsProps>('ChatDetails');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatDetails {...props} />;
};
