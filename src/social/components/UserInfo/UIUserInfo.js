import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button, { PrimaryButton } from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';

import { FollowersTabs } from '~/social/pages/UserFeed/Followers/constants';

import {
  Count,
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
} from './styles';

import { UserFeedTabs } from '~/social/pages/UserFeed/constants';

// TODO: react-intl
const UIUserInfo = ({
  userId,
  fileUrl,
  displayName,
  description,
  isMyProfile,
  postsCount,
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

  return (
    <Container>
      <Header>
        <Avatar avatar={fileUrl} backgroundImage={UserImage} />
        <OptionMenu options={allOptions} />
      </Header>
      <ProfileName>{displayName}</ProfileName>
      <CountContainer>
        <Count>{toHumanString(postsCount)}</Count> posts
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
          }}
        >
          {toHumanString(followerCount)}
        </ClickableCount>
        followings
        <ClickableCount
          onClick={() => {
            setActiveTab(UserFeedTabs.FOLLOWERS);
            setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {toHumanString(followingCount)}
        </ClickableCount>
        followers
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
    </Container>
  );
};

UIUserInfo.propTypes = {
  userId: PropTypes.string,
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  postsCount: PropTypes.number,
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
  postsCount: 0,
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
