import React from 'react';
import Truncate from 'react-truncate-markup';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage, useIntl } from 'react-intl';
import { FollowRequestStatus } from '@amityco/js-sdk';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button, { PrimaryButton } from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';

import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';
import { useSDK } from '~/core/hocs/withSDK';
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

import { UserFeedTabs } from '~/social/pages/UserFeed/constants';
import { confirm } from '~/core/components/Confirm';
import useUser from '~/core/hooks/useUser';
import useReport from '~/social/hooks/useReport';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import { notification } from '~/core/components/Notification';
import useFollowersList from '~/core/hooks/useFollowersList';

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
  isFollowPending,
  isFollowNone,
  isFollowAccepted,
  setActiveTab,
  setFollowActiveTab,
  followerCount,
  followingCount,
  isPrivateNetwork,
}) => {
  const { user } = useUser(userId);
  const { isFlaggedByMe, handleReport } = useReport(user);
  const { formatMessage } = useIntl();
  const { connected } = useSDK();

  const [onReportClick] = useAsyncCallback(async () => {
    await handleReport();
    notification.success({
      content: (
        <FormattedMessage id={isFlaggedByMe ? 'report.unreportSent' : 'report.reportSent'} />
      ),
    });
  }, [handleReport]);

  const title = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

  const content = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });

  const allOptions = [
    isFollowAccepted &&
      !isMyProfile && {
        name: 'user.unfollow',
        action: () =>
          confirm({
            title,
            content,
            cancelText: formatMessage({ id: 'buttonText.cancel' }),
            okText: formatMessage({ id: 'buttonText.unfollow' }),
            onOk: async () => {
              await onFollowDecline();
              setActiveTab(UserFeedTabs.TIMELINE);
            },
          }),
      },
    !isMyProfile && {
      name: isFlaggedByMe ? 'report.unreportUser' : 'report.reportUser',
      action: onReportClick,
    },
  ].filter(Boolean);

  const [pendingUsers] = useFollowersList(currentUserId, FollowRequestStatus.Pending);

  return (
    <Container>
      <Header>
        <Avatar avatar={fileUrl} backgroundImage={UserImage} />
        <ActionButtonContainer>
          <ConditionalRender condition={isMyProfile}>
            <Button disabled={!connected} onClick={() => onEditUser(userId)}>
              <PencilIcon /> <FormattedMessage id="user.editProfile" />
            </Button>
            <>
              {isPrivateNetwork && isFollowPending && (
                <Button disabled={!connected} onClick={() => onFollowDecline()}>
                  <PendingIconContainer>
                    <PendingIcon />
                  </PendingIconContainer>
                  <FormattedMessage id="user.cancel_follow" />
                </Button>
              )}
              {isFollowNone && (
                <PrimaryButton disabled={!connected} onClick={() => onFollowRequest()}>
                  <PlusIcon /> <FormattedMessage id="user.follow" />
                </PrimaryButton>
              )}
            </>
          </ConditionalRender>
        </ActionButtonContainer>
        <OptionMenu options={allOptions} pullRight={false} />
      </Header>
      <ProfileNameWrapper>
        <Truncate lines={3}>
          <ProfileName>{displayName}</ProfileName>
        </Truncate>
        {user.isGlobalBan && (
          <BanIcon width={14} height={14} css="margin-left: 0.265rem; margin-top: 1px;" />
        )}
      </ProfileNameWrapper>
      <CountContainer>
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
          }}
        >
          {toHumanString(followingCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followings" />
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {toHumanString(followerCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followers" />
      </CountContainer>
      <Description>{description}</Description>
      <ConditionalRender condition={isMyProfile && pendingUsers.length > 0 && isPrivateNetwork}>
        <PendingNotification
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
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
      </ConditionalRender>
    </Container>
  );
};

UIUserInfo.propTypes = {
  userId: PropTypes.string,
  currentUserId: PropTypes.string,
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  isMyProfile: PropTypes.bool,
  isFollowPending: PropTypes.bool,
  isFollowNone: PropTypes.bool,
  isFollowAccepted: PropTypes.bool,
  setActiveTab: PropTypes.func,
  setFollowActiveTab: PropTypes.func,
  followerCount: PropTypes.number,
  followingCount: PropTypes.number,
  isPrivateNetwork: PropTypes.bool,
  onEditUser: PropTypes.func,
  onFollowRequest: PropTypes.func,
  onFollowDecline: PropTypes.func,
};

UIUserInfo.defaultProps = {
  userId: '',
  currentUserId: '',
  fileUrl: '',
  displayName: '',
  description: '',
  isMyProfile: false,
  onEditUser: () => {},
  onFollowRequest: () => null,
  onFollowDecline: () => null,
  isFollowPending: false,
  isFollowNone: false,
  isFollowAccepted: false,
  setActiveTab: () => null,
  setFollowActiveTab: () => null,
  followerCount: 0,
  followingCount: 0,
};

export default customizableComponent('UIUserInfo', UIUserInfo);
