import React, { useEffect, useState } from 'react';
import MediaGallery from '~/social/components/MediaGallery';

import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import Feed from '~/social/components/Feed';
import Followers from '~/social/pages/UserFeed/Followers';

import { tabs, UserFeedTabs } from './constants';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/utils';
import { Wrapper } from './styles';
import useSDK from '~/core/hooks/useSDK';
import UserInfo from '~/social/components/UserInfo';
import useFollowStatus from '~/core/hooks/useFollowStatus';
import { isPrivateNetwork } from '~/helpers/utils';

interface UserFeedProps {
  userId?: string | null;
  socialSettings: Amity.SocialSettings | null;
}

const UserFeed = ({ userId, socialSettings }: UserFeedProps) => {
  const { currentUserId } = useSDK();

  const [activeTab, setActiveTab] = useState(UserFeedTabs.TIMELINE);
  const [followActiveTab, setFollowActiveTab] = useState(FollowersTabs.FOLLOWINGS);
  const followStatus = useFollowStatus(userId);

  const isMe = userId === currentUserId;

  const onUnFollow = async () => {
    setActiveTab(UserFeedTabs.TIMELINE);
  };

  const isFollowAccepted = followStatus === 'accepted';

  const isHiddenProfile = isPrivateNetwork(socialSettings) && !isFollowAccepted && !isMe;
  const filteredTabs = isHiddenProfile
    ? tabs.filter(({ value }) => value === UserFeedTabs.TIMELINE)
    : tabs;

  if (!userId) return null;

  return (
    // key prop is necessary here, without it this part will never re-render !!!
    <Wrapper>
      <UserInfo
        key={userId}
        userId={userId}
        onUnFollow={onUnFollow}
        onPendingNotificationClick={() => {
          setActiveTab(UserFeedTabs.FOLLOWERS);
          setFollowActiveTab(PENDING_TAB);
        }}
        onFollowingCountClick={() => {
          setActiveTab(UserFeedTabs.FOLLOWERS);
          setFollowActiveTab(FollowersTabs.FOLLOWINGS);
        }}
        onFollowerCountClick={() => {
          setActiveTab(UserFeedTabs.FOLLOWERS);
          setFollowActiveTab(FollowersTabs.FOLLOWERS);
        }}
      />

      <FeedHeaderTabs
        data-qa-anchor="user-feed-header"
        tabs={filteredTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === UserFeedTabs.TIMELINE && (
        <Feed
          targetType={isMe ? 'myFeed' : 'user'}
          targetId={userId}
          showPostCreator={isMe}
          isHiddenProfile={isHiddenProfile}
        />
      )}

      {activeTab === UserFeedTabs.GALLERY && <MediaGallery targetType={'user'} targetId={userId} />}

      {activeTab === UserFeedTabs.FOLLOWERS && !isHiddenProfile && (
        <Followers
          userId={userId}
          activeTab={followActiveTab}
          socialSettings={socialSettings}
          onFollowingListClick={(_userId) => setActiveTab(UserFeedTabs.TIMELINE)}
          onFollowerListClick={(_userId) => setActiveTab(UserFeedTabs.TIMELINE)}
          onTabChange={(tab) => setFollowActiveTab(tab)}
        />
      )}
    </Wrapper>
  );
};

export default UserFeed;
