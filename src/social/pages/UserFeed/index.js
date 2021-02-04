import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';

import withSDK from '~/core/hocs/withSDK';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
};

const UserFeed = ({ userId, currentUserId, onMessageUser }) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  return (
    <PageLayout aside={<UserInfo userId={userId} onMessageUser={onMessageUser} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <Feed
        targetType={EkoPostTargetType.UserFeed}
        targetId={userId}
        showPostCreator={userId === currentUserId}
      />
    </PageLayout>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onMessageUser: PropTypes.func,
};

UserFeed.defaultProps = {
  onMessageUser: () => {},
};

export default withSDK(UserFeed);
