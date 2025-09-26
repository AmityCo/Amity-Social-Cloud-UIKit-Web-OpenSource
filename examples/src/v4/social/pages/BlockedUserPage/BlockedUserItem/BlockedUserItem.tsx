import React, { FC } from 'react';
import styles from './BlockedUserItem.module.css';
import { UserListUnblockUserButton } from '~/v4/social/elements/UserListUnblockUserButton';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { Typography } from '~/v4/core/components';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import { Button } from '~/v4/core/components/AriaButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type BlockedUserItemProps = {
  pageId?: string;
  componentId?: string;
  user: Amity.User;
};

export const BlockedUserItem: FC<BlockedUserItemProps> = ({
  user,
  pageId = '*',
  componentId = '*',
}) => {
  const { unblockUser } = useUserBlock();
  const { goToUserProfilePage } = useNavigation();
  const { online } = useNetworkState();
  const notification = useNotifications();

  return (
    <div className={styles.blockUserItem}>
      <Button
        className={styles.blockUserItem__user}
        variant="text"
        onPress={() => goToUserProfilePage(user.userId)}
      >
        <UserAvatar userId={user.userId} className={styles.blockUserItem__avatar} />{' '}
        <Typography.BodyBold className={styles.blockUserItem__displayName}>
          {user.displayName}
        </Typography.BodyBold>
      </Button>

      <UserListUnblockUserButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => {
          if (!online) {
            notification.info({
              content: 'Failed to unblock user. Please try again.',
            });
            return;
          }
          unblockUser({
            pageId,
            componentId,
            userId: user.userId,
            displayName: user.displayName ?? user.userId,
          });
        }}
      />
    </div>
  );
};
