import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

import { tabs, UserFeedTabs } from './constants';

const UserFeed = ({ userId, currentUserId }) => {
  const [activeTab, setActiveTab] = useState(UserFeedTabs.TIMELINE);

  const isMe = userId === currentUserId;

  return (
    // key prop is necessary here, without it this part will never re-render !!!
    <PageLayout aside={<UserInfo key={userId} userId={userId} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <Feed
        targetType={isMe ? PostTargetType.MyFeed : PostTargetType.UserFeed}
        targetId={userId}
        showPostCreator={isMe}
      />
    </PageLayout>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default withSDK(UserFeed);
