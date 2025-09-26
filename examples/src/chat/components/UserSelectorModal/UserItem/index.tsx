import React from 'react';
import trim from 'lodash/trim';

import CheckCircleIcon from '~/icons/CheckCircle';
import UserAvatar from '~/chat/components/UserAvatar';

import styles from './styles.module.css';

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
    <div className={styles.userContainer} onClick={onClick}>
      <div className={styles.avatarContainer}>
        <UserAvatar avatarCustomUrl={avatarCustomUrl} avatarFileId={avatarFileId} />
      </div>
      <div className={styles.profileContainer}>
        {displayName || trim(name) || DEFAULT_DISPLAY_NAME}
      </div>
      {isSelected && (
        <div className={styles.checkIconWrapper}>
          <CheckCircleIcon />
        </div>
      )}
    </div>
  );
};

export default UserItem;
