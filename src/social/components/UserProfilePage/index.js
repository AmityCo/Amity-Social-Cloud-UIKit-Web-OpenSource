import React, { useState } from 'react';
import { EkoPostTargetType } from 'eko-sdk';

import withSDK from '~/core/hocs/withSDK';
import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import ProfilePageLayout from '~/social/components/ProfilePageLayout';
import Feed from '~/social/components/Feed';

// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
};

const UserProfilePage = ({
  userId,
  currentUserId,
  goToUserFeed,
  editProfile,
  blockRouteChange,
}) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  const isMyFeed = userId === currentUserId;

  return (
    <ProfilePageLayout profileInfo={<UserInfo userId={userId} editProfile={editProfile} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <Feed
        targetType={EkoPostTargetType.UserFeed}
        targetId={userId}
        onPostAuthorClick={goToUserFeed}
        editProfile={editProfile}
        blockRouteChange={blockRouteChange}
        showPostCreator={isMyFeed}
      />
    </ProfilePageLayout>
  );
};

export default withSDK(UserProfilePage);
