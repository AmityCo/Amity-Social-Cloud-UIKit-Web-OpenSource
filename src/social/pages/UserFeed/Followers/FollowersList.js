import { useIntl } from 'react-intl';
import React from 'react';

import useFollowersList from '~/core/hooks/useFollowersList';
import List from '~/social/pages/UserFeed/Followers/List';

const FollowersList = ({ currentUserId, profileUserId, setUserFeedTab }) => {
  const { formatMessage } = useIntl();

  return (
    <List
      profileUserId={profileUserId}
      currentUserId={currentUserId}
      emptyMessage={formatMessage({ id: 'follow.placeholder.noFollowers' })}
      hook={useFollowersList}
      setUserFeedTab={setUserFeedTab}
      allowRemoveUser
    />
  );
};

export default FollowersList;
