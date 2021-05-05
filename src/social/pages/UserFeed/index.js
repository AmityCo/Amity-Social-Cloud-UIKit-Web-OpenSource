import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
};

const UserFeed = ({ userId, currentUserId }) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  return (
    <PageLayout aside={<UserInfo userId={userId} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <Feed
        targetType={PostTargetType.UserFeed}
        targetId={userId}
        showPostCreator={userId === currentUserId}
      />
    </PageLayout>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default withSDK(UserFeed);
