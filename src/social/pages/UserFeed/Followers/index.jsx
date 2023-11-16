import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { FollowRequestStatus } from '@amityco/js-sdk';
import * as utils from '~/helpers/utils';

import { StyledTabs } from './styles';
import withSDK from '~/core/hocs/withSDK';

import FollowingsList from '~/social/pages/UserFeed/Followers/FollowingsList';
import FollowersList from '~/social/pages/UserFeed/Followers/FollowersList';
import PendingList from '~/social/pages/UserFeed/Followers/PendingList';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';
import useFollowersList from '~/core/hooks/useFollowersList';

const Followers = ({
  currentUserId,
  userId,
  activeTab,
  setActiveTab,
  networkSettings,
  setUserFeedTab,
}) => {
  const isPrivateNetwork = utils.isPrivateNetwork(networkSettings);

  const { formatMessage } = useIntl();
  const [allTabs, setAllTabs] = useState(
    Object.values(FollowersTabs).map((value) => ({
      value,
      label: value,
    })),
  );

  const [pendingUsers] = useFollowersList(currentUserId, FollowRequestStatus.Pending);

  const isMe = currentUserId === userId;

  useEffect(() => {
    if (pendingUsers?.length && isMe && isPrivateNetwork) {
      setAllTabs(
        Object.values(FollowersTabs)
          .map((value) => ({
            value,
            label: value,
          }))
          .concat({
            value: PENDING_TAB,
            label: formatMessage({ id: 'tabs.pending' }),
          }),
      );
    } else {
      setAllTabs(
        Object.values(FollowersTabs).map((value) => ({
          value,
          label: value,
        })),
      );

      setActiveTab(FollowersTabs.FOLLOWINGS);
    }
  }, [formatMessage, isMe, isPrivateNetwork, pendingUsers, setActiveTab]);

  return (
    <div>
      <StyledTabs tabs={allTabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === FollowersTabs.FOLLOWINGS && (
        <FollowingsList
          currentUserId={currentUserId}
          profileUserId={userId}
          setUserFeedTab={setUserFeedTab}
        />
      )}

      {activeTab === FollowersTabs.FOLLOWERS && (
        <FollowersList
          currentUserId={currentUserId}
          profileUserId={userId}
          setUserFeedTab={setUserFeedTab}
        />
      )}

      {activeTab.includes(PENDING_TAB) && isMe && isPrivateNetwork && <PendingList />}
    </div>
  );
};

Followers.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  networkSettings: PropTypes.object.isRequired,
  setUserFeedTab: PropTypes.func.isRequired,
};

export default withSDK(Followers);
