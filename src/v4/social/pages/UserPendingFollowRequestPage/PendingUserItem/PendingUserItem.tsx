import React, { FC } from 'react';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import styles from './PendingUserItem.module.css';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button/Button';
import { UserRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type PendingUserItemProps = {
  userId: string;
};

export const PendingUserItem: FC<PendingUserItemProps> = ({ userId }) => {
  const { user } = useUser({ userId });
  const { success, error } = useNotifications();

  const acceptFollow = async ({ userId, displayName }: { userId: string; displayName: string }) => {
    try {
      await UserRepository.Relationship.acceptMyFollower(userId);
      success({
        content: `${displayName} is now following you.`,
      });
    } catch (e) {
      error({
        content: 'Failed to accept follow request.',
      });
    }
  };

  const declineFollow = async ({ userId }: { userId: string }) => {
    try {
      await UserRepository.Relationship.declineMyFollower(userId);
      success({
        content: 'Following request declined.',
      });
    } catch (e) {
      error({
        content: 'Failed to decline follow request.',
      });
    }
  };

  if (!user) return null;

  return (
    <div className={styles.pendingUserItem}>
      <div className={styles.pendingUserItem__info}>
        <UserAvatar userId={userId} className={styles.pendingUserItem__userAvatar} />
        <Typography.Body className={styles.pendingUserItem__displayName}>
          {user?.displayName}
        </Typography.Body>
      </div>
      <div className={styles.pendingUserItem__buttonWrap}>
        <Button
          className={styles.pendingUserItem__button__accept}
          onPress={() =>
            acceptFollow({
              userId: user.userId,
              displayName: user.displayName!,
            })
          }
        >
          Accept
        </Button>
        <Button
          className={styles.pendingUserItem__button__decline}
          onPress={() =>
            declineFollow({
              userId: user.userId,
            })
          }
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
