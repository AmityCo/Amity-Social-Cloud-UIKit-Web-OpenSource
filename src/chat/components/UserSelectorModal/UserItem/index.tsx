import React from 'react';
import trim from 'lodash/trim';

import CheckCircleIcon from '~/icons/CheckCircle';
import UserAvatar from '~/chat/components/UserAvatar';

import { UserContainer, AvatarContainer, ProfileContainer, CheckIconWrapper } from './styles';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

interface UserItemProps {
  displayName?: string;
  metadata?: Record<string, string>;
  onClick: () => void;
  avatarCustomUrl?: string;
  avatarFileId?: string;
  isSelected?: boolean;
}

const UserItem = ({
  displayName,
  metadata,
  onClick,
  avatarCustomUrl,
  avatarFileId,
  isSelected = false,
}: UserItemProps) => {
  // TODO: This code is Personal Mode specific - need to abstract it out.
  const { firstname = '', lastname = '' } = metadata ?? {};
  const name = `${firstname} ${lastname}`;

  return (
    <UserContainer onClick={onClick}>
      <AvatarContainer>
        <UserAvatar avatarCustomUrl={avatarCustomUrl} avatarFileId={avatarFileId} />
      </AvatarContainer>
      <ProfileContainer>{displayName || trim(name) || DEFAULT_DISPLAY_NAME}</ProfileContainer>
      {isSelected && (
        <CheckIconWrapper>
          <CheckCircleIcon />
        </CheckIconWrapper>
      )}
    </UserContainer>
  );
};

export default UserItem;
