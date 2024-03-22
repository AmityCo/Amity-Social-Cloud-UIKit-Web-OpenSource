import React from 'react';
import { FormattedMessage } from 'react-intl';

import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as backgroundUserImage } from '~/icons/User';

import AddNewMember from './AddNewMember';

import {
  ChatMembersContainer,
  MembersReturn,
  MembersArrowLeft,
  MembersReturnTitle,
  MemberItem,
  MemberItemInfo,
} from './styles';
import { SIZE_ALIAS } from '~/core/hooks/useSize';
import LoadMoreWrapper from '~/social/components/LoadMoreWrapper';
import useChannel from '~/chat/hooks/useChannel';
import useChannelMembersCollection from '~/chat/hooks/collections/useChannelMembersCollection';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

interface ChatDetailsMembersProps {
  channelId?: string;
  hideMembers?: () => void;
  onEditChatMemberClick?: ({
    channelId,
    members,
  }: {
    channelId?: string;
    members: Amity.Membership<'channel'>[];
  }) => void;
  onMemberSelect?: (member: Amity.Membership<'channel'>) => void;
}

const ChatDetailsMembers = ({
  channelId,
  hideMembers,
  onEditChatMemberClick,
  onMemberSelect,
}: ChatDetailsMembersProps) => {
  const channel = useChannel(channelId);
  const { channelMembers: members, hasMore, loadMore } = useChannelMembersCollection(channelId);

  const handleReturnClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    hideMembers?.();
  };

  const getName = (member: Amity.Membership<'channel'>) => {
    const { displayName, metadata } = member?.user ?? {};

    if (displayName) return displayName;

    const { firstname = '', lastname = '' } = metadata ?? {};
    const name = [firstname, lastname].filter(Boolean).join(' ');

    return name.trim();
  };

  const isShowAddMemberButton = channel?.type === 'live' || channel?.type === 'community';

  return (
    <ChatMembersContainer>
      <MembersReturn onClick={handleReturnClick}>
        <MembersArrowLeft />
        <MembersReturnTitle>
          <FormattedMessage id="chat.members.return" />
        </MembersReturnTitle>
      </MembersReturn>
      {members?.length > 0 ? (
        <LoadMoreWrapper
          hasMore={hasMore}
          loadMore={loadMore}
          contentSlot={
            <>
              {members.map((member) => (
                <MemberItem key={member.userId} onClick={() => onMemberSelect?.(member)}>
                  <UserAvatar
                    size={SIZE_ALIAS.SMALL}
                    defaultImage={backgroundUserImage}
                    {...member?.user}
                  />
                  <MemberItemInfo>{getName(member) || DEFAULT_DISPLAY_NAME}</MemberItemInfo>
                </MemberItem>
              ))}

              {isShowAddMemberButton ? (
                <AddNewMember onClick={() => onEditChatMemberClick?.({ channelId, members })} />
              ) : null}
            </>
          }
        />
      ) : null}
    </ChatMembersContainer>
  );
};

export default ChatDetailsMembers;
