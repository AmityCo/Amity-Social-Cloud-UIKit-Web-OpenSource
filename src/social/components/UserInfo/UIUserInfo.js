import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button, { PrimaryButton } from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';

import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';

import {
  Avatar,
  Container,
  ProfileName,
  Header,
  Description,
  MessageIcon,
  PencilIcon,
  PendingIcon,
  OptionMenu,
  CountContainer,
  ClickableCount,
  PendingNotification,
  NotificationTitle,
  NotificationBody,
  TitleEllipse,
} from './styles';

import { UserFeedTabs } from '~/social/pages/UserFeed/constants';
import useFollowCount from '~/core/hooks/useFollowCount';

const UIUserInfo = ({
  userId,
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
}) => {
  const allOptions = [
    isFollowAccepted && {
      name: 'user.unfollow',
      action: onFollowDecline,
    },
  ].filter(Boolean);

  const { pendingCount } = useFollowCount(userId);

  return (
    <Container>
      <Header>
        <Avatar avatar={fileUrl} backgroundImage={UserImage} />
        <OptionMenu options={allOptions} />
      </Header>
      <ProfileName>{displayName}</ProfileName>
      <CountContainer>
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {toHumanString(followerCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followers" />
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
          }}
        >
          {toHumanString(followingCount)}
        </ClickableCount>
        <FormattedMessage id="counter.followings" />
      </CountContainer>
      <Description>{description}</Description>
      <ConditionalRender condition={isMyProfile}>
        <Button fullWidth onClick={() => onEditUser(userId)}>
          <PencilIcon /> <FormattedMessage id="user.editProfile" />
        </Button>
        <>
          {isFollowPending && (
            <Button fullWidth onClick={() => onFollowDecline()}>
              <PendingIcon /> <FormattedMessage id="user.cancel_follow" />
            </Button>
          )}
          {isFollowNone && (
            <PrimaryButton fullWidth onClick={() => onFollowRequest()}>
              <MessageIcon /> <FormattedMessage id="user.follow" />
            </PrimaryButton>
          )}
        </>
      </ConditionalRender>
      <ConditionalRender condition={isMyProfile && pendingCount > 0}>
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
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  isMyProfile: PropTypes.bool,
  onEditUser: PropTypes.func,
  onFollowRequest: PropTypes.func,
  onFollowDecline: PropTypes.func,
  isFollowPending: PropTypes.bool,
  isFollowNone: PropTypes.bool,
  isFollowAccepted: PropTypes.bool,
  setActiveTab: PropTypes.func,
  setFollowActiveTab: PropTypes.func,
  followerCount: PropTypes.number,
  followingCount: PropTypes.number,
};

UIUserInfo.defaultProps = {
  userId: '',
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
