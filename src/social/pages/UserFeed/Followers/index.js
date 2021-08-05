import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { FollowRequestStatus } from '@amityco/js-sdk';
import { StyledTabs } from './styles';
import ConditionalRender from '~/core/components/ConditionalRender';
import withSDK from '~/core/hocs/withSDK';
import useFollowersList from '~/core/hooks/useFollowersList';
import FollowingsList from '~/social/pages/UserFeed/Followers/FollowingsList';
import FollowersList from '~/social/pages/UserFeed/Followers/FollowersList';
import PendingList from '~/social/pages/UserFeed/Followers/PendingList';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';

const Followers = ({ currentUserId, userId, activeTab, setActiveTab }) => {
  const { formatMessage } = useIntl();
  const [allTabs, setAllTabs] = useState(
    Object.values(FollowersTabs).map(value => ({
      value,
      label: value,
    })),
  );

  const [pendingUsers] = useFollowersList(currentUserId, FollowRequestStatus.Pending);

  const isMe = currentUserId === userId;

  useEffect(() => {
    if (pendingUsers.length && isMe) {
      setAllTabs(
        Object.values(FollowersTabs)
          .map(value => ({
            value,
            label: value,
          }))
          .concat({
            value: PENDING_TAB,
            label: `${formatMessage({ id: 'tabs.pending' })} (${pendingUsers.length})`,
          }),
      );
    } else {
      setAllTabs(
        Object.values(FollowersTabs).map(value => ({
          value,
          label: value,
        })),
      );

      setActiveTab(FollowersTabs.FOLLOWINGS);
    }
  }, [pendingUsers]);

  return (
    <div>
      <StyledTabs tabs={allTabs} activeTab={activeTab} onChange={setActiveTab} />
      <ConditionalRender condition={activeTab === FollowersTabs.FOLLOWINGS}>
        <FollowingsList currentUserId={userId} />
      </ConditionalRender>
      <ConditionalRender condition={activeTab === FollowersTabs.FOLLOWERS}>
        <FollowersList currentUserId={userId} isMe={isMe} />
      </ConditionalRender>
      <ConditionalRender condition={activeTab.includes(PENDING_TAB) && isMe}>
        <PendingList pendingUsers={pendingUsers} />
      </ConditionalRender>
    </div>
  );
};

Followers.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default withSDK(Followers);
