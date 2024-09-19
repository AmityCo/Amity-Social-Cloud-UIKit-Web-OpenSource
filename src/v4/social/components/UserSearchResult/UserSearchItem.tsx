import React from 'react';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { Typography } from '~/v4/core/components';
import styles from './UserSearchItem.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';

interface UserSearchItemProps {
  user: Amity.User;
  onClick?: () => void;
}

export const UserSearchItem = ({ user }: UserSearchItemProps) => {
  const { onClickUser } = useNavigation();

  return (
    <Button key={user.userId} className={styles.userItem} onPress={() => onClickUser(user.userId)}>
      <div className={styles.userItem__leftPane}>
        <UserAvatar userId={user.userId} className={styles.userItem__avatar} />
      </div>
      <div className={styles.userItem__rightPane}>
        <div className={styles.userItem__userName}>
          <Typography.BodyBold className={styles.userItem__userName__text}>
            {user.displayName}
          </Typography.BodyBold>
          {!user.isBrand ? (
            <div className={styles.userItem__brandIcon__container}>
              <BrandBadge className={styles.userItem__brandIcon} />
            </div>
          ) : null}
        </div>
      </div>
    </Button>
  );
};
