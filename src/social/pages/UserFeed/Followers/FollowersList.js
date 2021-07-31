import { useIntl } from 'react-intl';
import React from 'react';

import useFollowersList from '~/core/hooks/useFollowersList';
import List from '~/social/pages/UserFeed/Followers/List';

const FollowersList = ({ currentUserId }) => {
  const { formatMessage } = useIntl();

  return (
    <List
      currentUserId={currentUserId}
      emptyMessage={formatMessage({ id: 'follow.placeholder.noFollowers' })}
      hook={useFollowersList}
      allowRemoveUser
    />
  );
};

export default FollowersList;
