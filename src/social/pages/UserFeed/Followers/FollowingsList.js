import { useIntl } from 'react-intl';
import React from 'react';

import useFollowingsList from '~/core/hooks/useFollowingsList';
import List from '~/social/pages/UserFeed/Followers/List';

const FollowingsList = ({ currentUserId }) => {
  const { formatMessage } = useIntl();
  return (
    <List
      currentUserId={currentUserId}
      emptyMessage={formatMessage({ id: 'follow.placeholder.noFollowings' })}
      hook={useFollowingsList}
    />
  );
};

export default FollowingsList;
