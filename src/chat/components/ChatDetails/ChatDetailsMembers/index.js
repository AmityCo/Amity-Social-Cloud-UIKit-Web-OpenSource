import React from 'react';
import { FormattedMessage } from 'react-intl';

import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as backgroundUserImage } from '~/icons/User';
import { SIZE_ALIAS } from '~/core/hocs/withSize';
import useChannel from '~/chat/hooks/useChannel';
import useChannelMembers from '~/chat/hooks/useChannelMembers';

// TODO: no import from social
import LoadMore from '~/social/components/LoadMore';

import AddNewMember from './AddNewMember';

import {
  ChatMembersContainer,
  MembersReturn,
  MembersArrowLeft,
  MembersReturnTitle,
  MemberItem,
  MemberItemInfo,
} from './styles';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const ChatDetailsMembers = ({ channelId, hideMembers, onEditChatMemberClick, onMemberSelect }) => {
  const channel = useChannel(channelId);
  const [members, hasMore, loadMore] = useChannelMembers(channelId, channel.memberCount);

  const handleReturnClick = e => {
    e.stopPropagation();
    hideMembers();
  };

  const getName = member => {
    const { displayName, metadata } = member?.user?.model ?? {};

    if (displayName) return displayName;

    const { firstname = '', lastname = '' } = metadata ?? {};
    const name = `${firstname} ${lastname}`;

    return name.trim();
  };

  return (
    <ChatMembersContainer>
      <MembersReturn onClick={handleReturnClick}>
        <MembersArrowLeft />
        <MembersReturnTitle>
          <FormattedMessage id="chat.members.return" />
        </MembersReturnTitle>
      </MembersReturn>
      <LoadMore hasMore={hasMore} loadMore={loadMore}>
        {members.map(member => (
          <MemberItem key={member.userId} onClick={() => onMemberSelect(member)}>
            <UserAvatar
              size={SIZE_ALIAS.SMALL}
              defaultImage={backgroundUserImage}
              {...member?.user?.model}
            />
            <MemberItemInfo>{getName(member) || DEFAULT_DISPLAY_NAME}</MemberItemInfo>
          </MemberItem>
        ))}

        {onEditChatMemberClick && (
          <AddNewMember onClick={() => onEditChatMemberClick({ channelId, members })} />
        )}
      </LoadMore>
    </ChatMembersContainer>
  );
};

export default ChatDetailsMembers;
