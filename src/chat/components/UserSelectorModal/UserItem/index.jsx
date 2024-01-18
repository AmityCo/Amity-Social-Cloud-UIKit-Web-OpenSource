import React from 'react';
import trim from 'lodash/trim';

import CheckCircleIcon from '~/icons/CheckCircle';
import UserAvatar from '~/chat/components/UserAvatar';

import { Usercontainer, AvatarContainer, ProfileContainer, CheckIconWrapper } from './styles';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserItem = ({
  displayName,
  metadata,
  onClick,
  avatarCustomUrl,
  avatarFileId,
  isSelected = false,
}) => {
  // TODO: This code is Personal Mode specific - need to abstract it out.
  const { firstname = '', lastname = '' } = metadata ?? {};
  const name = `${firstname} ${lastname}`;

  return (
    <Usercontainer onClick={onClick}>
      <AvatarContainer>
        <UserAvatar avatarCustomUrl={avatarCustomUrl} avatarFileId={avatarFileId} />
      </AvatarContainer>
      <ProfileContainer>{displayName || trim(name) || DEFAULT_DISPLAY_NAME}</ProfileContainer>
      {isSelected && (
        <CheckIconWrapper>
          <CheckCircleIcon />
        </CheckIconWrapper>
      )}
    </Usercontainer>
  );
};

export default UserItem;
