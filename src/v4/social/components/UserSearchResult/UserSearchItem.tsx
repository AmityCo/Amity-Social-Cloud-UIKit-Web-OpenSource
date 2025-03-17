import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import styles from './UserSearchItem.module.css';

interface UserSearchItemProps {
  pageId?: string;
  user: Amity.User;
  componentId?: string;
  onClick?: () => void;
}

export const UserSearchItem = ({
  user,
  onClick,
  pageId = '*',
  componentId = '*',
}: UserSearchItemProps) => {
  const { onClickUser } = useNavigation();

  return (
    <Button
      key={user.userId}
      className={styles.userItem}
      onPress={() => {
        onClick?.();
        onClickUser(user.userId);
      }}
    >
      <div
        data-testid={`${pageId}/${componentId}/search_user_avatar`}
        className={styles.userItem__leftPane}
      >
        <UserAvatar
          pageId={pageId}
          userId={user.userId}
          componentId={componentId}
          className={styles.userItem__avatar}
        />
      </div>
      <div className={styles.userItem__rightPane}>
        <div className={styles.userItem__userName}>
          <Typography.BodyBold
            className={styles.userItem__userName__text}
            data-testid={`${pageId}/${componentId}/search_username`}
          >
            {user.displayName}
          </Typography.BodyBold>
          {user.isBrand ? (
            <div className={styles.userItem__brandIcon__container}>
              <BrandBadge className={styles.userItem__brandIcon} />
            </div>
          ) : null}
        </div>
      </div>
    </Button>
  );
};
