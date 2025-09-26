import React from 'react';
import styles from './UserMenu.module.css';
import { Button } from '~/v4/core/natives/Button';
import Pencil from '~/v4/icons/Pencil';
import BlockedUser from '~/v4/icons/BlockedUser';
import { Typography } from '~/v4/core/components';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import useUserReportedByMe from '~/v4/social/hooks/useUserReportedByMe';
import useUserReport from '~/v4/social/hooks/useUserReport';
import Flag from '~/v4/icons/Flag';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { useNetworkState } from 'react-use';

interface UserMenuProps {
  user?: Amity.User | null;
  pageId?: string;
  componentId?: string;
  onCloseMenu: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  pageId = '*',
  componentId = '*',
  onCloseMenu,
}) => {
  const { currentUserId } = useSDK();
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { isReportedByMe } = useUserReportedByMe(user?.userId);
  const { blockUser, unblockUser } = useUserBlock();
  const { reportUser, unReportUser } = useUserReport();
  const { AmityUserProfilePageBehavior } = usePageBehavior();
  const { followStatus } = useFollowCount(user?.userId);
  const isCurrentUser = user?.userId === currentUserId;

  if (!user) return null;

  const onEditProfile = () => {
    onCloseMenu();
    AmityUserProfilePageBehavior?.goToEditUserPage?.({ userId: user.userId });
  };

  return (
    <div className={styles.userMenu}>
      {isCurrentUser && (
        <Button
          data-testid={`${pageId}/${componentId}/edit_user_profile_button`}
          className={styles.userMenu__button}
          onPress={onEditProfile}
        >
          <Pencil className={styles.userMenu__editProfile__icon} />
          <Typography.BodyBold className={styles.userMenu__editProfile__text}>
            Edit profile
          </Typography.BodyBold>
        </Button>
      )}
      {!isCurrentUser && (
        <Button
          data-testid={`${pageId}/${componentId}/block_user_button`}
          className={styles.userMenu__button}
          onPress={() => {
            onCloseMenu();
            if (!online) {
              notification.info({
                content: `Failed to ${isReportedByMe ? 'unreport' : 'report'} user. Please try again.`,
              });
              return;
            }
            if (isReportedByMe) unReportUser(user.userId);
            else reportUser(user.userId);
          }}
        >
          <Flag className={styles.userMenu__reportUser__icon} />
          <Typography.BodyBold className={styles.userMenu__reportUser__text}>
            {isReportedByMe ? 'Unreport user' : 'Report user'}
          </Typography.BodyBold>
        </Button>
      )}

      <Button
        data-testid={`${pageId}/${componentId}/manage_blocked_users_button`}
        className={styles.userMenu__button}
        onPress={() => {
          onCloseMenu();
          if (isCurrentUser) {
            AmityUserProfilePageBehavior?.goToBlockedUsersPage?.();
            onCloseMenu();
          } else {
            if (!online) {
              notification.info({
                content: `Failed to ${followStatus === 'blocked' ? 'unblock' : 'block'} user. Please try again.`,
              });
              return;
            }
            followStatus === 'blocked'
              ? unblockUser({
                  pageId,
                  componentId,
                  userId: user.userId,
                  displayName: user.displayName ?? user.userId,
                })
              : blockUser({
                  pageId,
                  componentId,
                  userId: user.userId,
                  displayName: user.displayName ?? user.userId,
                });
          }
        }}
      >
        <BlockedUser className={styles.userMenu__blockedUser__icon} />
        <Typography.BodyBold className={styles.userMenu__blockedUser__text}>
          {isCurrentUser
            ? 'Manage blocked users'
            : followStatus === 'blocked'
              ? 'Unblock user'
              : 'Block user'}
        </Typography.BodyBold>
      </Button>
    </div>
  );
};
