import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';

import withSDK from '~/core/hocs/withSDK';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import FeedLayout from '~/social/layouts/Feed';
import Feed from '~/social/components/Feed';

// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
};

const UserFeed = ({ userId, currentUserId, onClickUser, onEditUser, onMessageUser }) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  return (
    <FeedLayout
      aside={<UserInfo userId={userId} onEditUser={onEditUser} onMessageUser={onMessageUser} />}
    >
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <Feed
        targetType={EkoPostTargetType.UserFeed}
        targetId={userId}
        onClickUser={onClickUser}
        showPostCreator={userId === currentUserId}
      />
    </FeedLayout>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onClickUser: PropTypes.func,
  onEditUser: PropTypes.func,
  onMessageUser: PropTypes.func,
};

UserFeed.defaultProps = {
  onClickUser: () => {},
  onEditUser: () => {},
  onMessageUser: () => {},
};

export default withSDK(UserFeed);
