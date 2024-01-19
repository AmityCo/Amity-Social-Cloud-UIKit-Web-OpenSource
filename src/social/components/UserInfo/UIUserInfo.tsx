import React, { useEffect, useState } from 'react';
import Truncate from 'react-truncate-markup';
import millify from 'millify';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, { PrimaryButton } from '~/core/components/Button';

import { backgroundImage as UserImage } from '~/icons/User';

import BanIcon from '~/icons/Ban';

import {
  Avatar,
  Container,
  ProfileName,
  Header,
  Description,
  PlusIcon,
  PencilIcon,
  PendingIcon,
  OptionMenu,
  CountContainer,
  ClickableCount,
  PendingNotification,
  NotificationTitle,
  NotificationBody,
  TitleEllipse,
  PendingIconContainer,
  ActionButtonContainer,
  ProfileNameWrapper,
} from './styles';

import { confirm } from '~/core/components/Confirm';
import { isNonNullable } from '~/helpers/utils';
import useUser from '~/core/hooks/useUser';
import { UserRepository } from '@amityco/ts-sdk';
import useFollowersList from '~/core/hooks/useFollowersList';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useUserFlaggedByMe from '~/social/hooks/useUserFlaggedByMe';
import useFollowersCollection from '~/core/hooks/collections/useFollowersCollection';

interface UIUserInfoProps {
  userId?: string | null;
  currentUserId?: string | null;
  fileUrl?: string;
  displayName?: string;
  description?: string;
  isMyProfile?: boolean;
  onEditUser?: (userId: string) => void;
  onFollowRequest?: () => void;
  onUnFollow?: () => void;
  onFollowDecline?: () => void | Promise<void>;
  isFollowPending?: boolean;
  isFollowNone?: boolean;
  isFollowAccepted?: boolean;
  onPendingNotificationClick?: () => void;
  onFollowingCountClick?: () => void;
  onFollowerCountClick?: () => void;
  onReportClick?: () => void;
  followerCount?: number;
  followingCount?: number;
  isPrivateNetwork?: boolean;
  isFlaggedByMe?: boolean;
}

const UIUserInfo = ({
  userId,
  currentUserId,
  fileUrl,
  displayName,
  description,
  isMyProfile,
  onEditUser,
  onFollowRequest,
  onFollowDecline,
  onUnFollow,
  onPendingNotificationClick,
  onFollowingCountClick,
  onFollowerCountClick,
  onReportClick,
  isFollowPending,
  isFollowNone,
  isFollowAccepted,
  followerCount = 0,
  followingCount = 0,
  isPrivateNetwork,
}: UIUserInfoProps) => {
  const user = useUser(userId);
  const { formatMessage } = useIntl();
  const { isFlaggedByMe } = useUserFlaggedByMe(userId || undefined);

  const { followers: pendingUsers } = useFollowersCollection({
    userId: currentUserId,
    status: 'pending',
  });

  const title = user?.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

  const content = user?.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });

  const allOptions: Array<{ name: string; action: () => void }> = [
    isFollowAccepted && !isMyProfile
      ? {
          name: formatMessage({ id: 'user.unfollow' }),
          action: () =>
            confirm({
              title,
              content,
              cancelText: formatMessage({ id: 'buttonText.cancel' }),
              okText: formatMessage({ id: 'buttonText.unfollow' }),
              onOk: async () => {
                await onUnFollow?.();
              },
            }),
        }
      : undefined,
    !isMyProfile
      ? {
          name: isFlaggedByMe
            ? formatMessage({ id: 'report.unreportUser' })
            : formatMessage({ id: 'report.reportUser' }),
          action: () => {
            onReportClick?.();
          },
        }
      : undefined,
  ].filter(isNonNullable);

  return (
    <Container data-qa-anchor="user-info">
      <Header>
        <Avatar
          data-qa-anchor="user-info-profile-image"
          avatar={fileUrl}
          backgroundImage={UserImage}
        />
        <ActionButtonContainer>
          {isMyProfile ? (
            <Button
              data-qa-anchor="user-info-edit-profile-button"
              onClick={() => user?.userId && onEditUser?.(user.userId)}
            >
              <PencilIcon /> <FormattedMessage id="user.editProfile" />
            </Button>
          ) : (
            <>
              {isPrivateNetwork && isFollowPending && (
                <Button onClick={() => onFollowDecline?.()}>
                  <PendingIconContainer>
                    <PendingIcon />
                  </PendingIconContainer>
                  <FormattedMessage id="user.cancel_follow" />
                </Button>
              )}
              {isFollowNone && (
                <PrimaryButton onClick={() => onFollowRequest?.()}>
                  <PlusIcon /> <FormattedMessage id="user.follow" />
                </PrimaryButton>
              )}
            </>
          )}
        </ActionButtonContainer>
        <OptionMenu options={allOptions} pullRight={false} />
      </Header>
      <ProfileNameWrapper>
        <Truncate lines={3}>
          <ProfileName data-qa-anchor="user-info-profile-name">{displayName}</ProfileName>
        </Truncate>

        {user?.isGlobalBanned ? (
          <BanIcon style={{ marginLeft: '0.265rem', marginTop: '1px' }} />
        ) : null}
      </ProfileNameWrapper>
      <CountContainer>
        <ClickableCount
          onClick={() => {
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
            onFollowingCountClick?.();
          }}
        >
          {millify(followingCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followings" />
        <ClickableCount
          onClick={() => {
            onFollowerCountClick?.();
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {millify(followerCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followers" />
      </CountContainer>
      <Description data-qa-anchor="user-info-description">{description}</Description>

      {isMyProfile && pendingUsers.length > 0 && isPrivateNetwork && (
        <PendingNotification
          onClick={() => {
            onPendingNotificationClick?.();
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
          }}
        >
          <NotificationTitle>
            <TitleEllipse />
            <FormattedMessage id="follow.pendingNotification.title" />
          </NotificationTitle>
          <NotificationBody>
            <FormattedMessage id="follow.pendingNotification.body" />
          </NotificationBody>
        </PendingNotification>
      )}
    </Container>
  );
};

export default (props: UIUserInfoProps) => {
  const CustomComponentFn = useCustomComponent<UIUserInfoProps>('UIUserInfo');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIUserInfo {...props} />;
};
