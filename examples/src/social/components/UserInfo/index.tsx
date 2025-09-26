import React, { memo, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useNavigation } from '~/social/providers/NavigationProvider';
import useFollowCount from '~/core/hooks/useFollowCount';
import useImage from '~/core/hooks/useImage';
import useSDK from '~/core/hooks/useSDK';
import { SubscriptionLevels, UserRepository } from '@amityco/ts-sdk';
import useFollowStatus from '~/core/hooks/useFollowStatus';

import UIUserInfo from './UIUserInfo';
import useUserSubscription from '~/social/hooks/useUserSubscription';
import useFollowersSubscription from '~/social/hooks/useFollowersSubscription';
import useFollowingsSubscription from '~/social/hooks/useFollowingsSubscription';
import { useNotifications } from '~/core/providers/NotificationProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';

interface UserInfoProps {
  userId?: string | null;
  onUnFollow?: () => void;
  isPrivateNetwork?: boolean;
  onFollowingCountClick?: () => void;
  onFollowerCountClick?: () => void;
  onPendingNotificationClick?: () => void;
}

const UserInfo = ({
  userId,
  onUnFollow,
  onFollowingCountClick,
  onFollowerCountClick,
  onPendingNotificationClick,
  isPrivateNetwork,
}: UserInfoProps) => {
  const { currentUserId } = useSDK();
  const { formatMessage } = useIntl();
  const { onEditUser } = useNavigation();
  const notification = useNotifications();
  const { user, refresh } = useUser({ userId });
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  useEffect(() => {
    refresh();
  }, []);

  useUserSubscription({
    userId,
    level: SubscriptionLevels.USER,
  });

  useFollowersSubscription({
    userId: currentUserId,
  });

  useFollowingsSubscription({
    userId: currentUserId,
  });

  const followStatus = useFollowStatus(userId);
  const onFollowDecline = async () => {
    if (!userId) return;
    await UserRepository.Relationship.declineMyFollower(userId);
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  };

  const onUnFollowFn = async () => {
    if (!userId) return;
    await UserRepository.Relationship.unfollow(userId);
    onUnFollow?.();
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  };

  const { followerCount, followingCount } = useFollowCount(userId);

  const onFollowRequest = async () => {
    if (!userId) return;
    await UserRepository.Relationship.follow(userId);
  };

  if (followStatus == null) return null;

  const isFollowNone = followStatus === 'none';
  const isFollowAccepted = followStatus === 'accepted';
  const isFollowPending = followStatus === 'pending';

  return (
    <UIUserInfo
      userId={userId}
      currentUserId={currentUserId}
      fileUrl={user?.avatarCustomUrl || avatarFileUrl}
      displayName={user?.displayName || formatMessage({ id: 'anonymous' })}
      description={user?.description}
      onFollowerCountClick={onFollowerCountClick}
      onFollowingCountClick={onFollowingCountClick}
      onPendingNotificationClick={onPendingNotificationClick}
      onFollowDecline={onFollowDecline}
      onFollowRequest={onFollowRequest}
      onUnFollow={onUnFollowFn}
      onEditUser={onEditUser}
      isMyProfile={userId === currentUserId}
      isFollowPending={isFollowPending}
      isPrivateNetwork={isPrivateNetwork}
      isFollowNone={isFollowNone}
      isFollowAccepted={isFollowAccepted}
      followerCount={followerCount}
      followingCount={followingCount}
    />
  );
};

export default memo(UserInfo);
