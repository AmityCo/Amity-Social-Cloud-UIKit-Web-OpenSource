import React from 'react';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { Typography } from '~/v4/core/components/index';
import styles from './UserSearchItem.module.css';

interface UserSearchItemProps {
  user: Amity.User;
}

export const UserSearchItem = ({ user }: UserSearchItemProps) => {
  return (
    <div key={user.userId} className={styles.userItem}>
      <div className={styles.userItem__leftPane}>
        <UserAvatar userId={user.userId} className={styles.userItem__avatar} />
      </div>
      <div className={styles.userItem__rightPane}>
        <div className={styles.userItem__userName}>
          <Typography.BodyBold className={styles.userItem__userName__text}>
            {user.displayName}
          </Typography.BodyBold>
        </div>
      </div>
    </div>
  );
};
