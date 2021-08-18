import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { StyledTabs } from './styles';
import ConditionalRender from '~/core/components/ConditionalRender';
import withSDK from '~/core/hocs/withSDK';

import FollowingsList from '~/social/pages/UserFeed/Followers/FollowingsList';
import FollowersList from '~/social/pages/UserFeed/Followers/FollowersList';
import PendingList from '~/social/pages/UserFeed/Followers/PendingList';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';
import useFollowCount from '~/core/hooks/useFollowCount';

const Followers = ({
  currentUserId,
  userId,
  activeTab,
  setActiveTab,
  networkSettings,
  setUserFeedTab,
}) => {
  const isPrivateNetwork = networkSettings?.isPrivateNetwork;

  const { formatMessage } = useIntl();
  const [allTabs, setAllTabs] = useState(
    Object.values(FollowersTabs).map(value => ({
      value,
      label: value,
    })),
  );

  const { pendingCount } = useFollowCount(userId);

  const isMe = currentUserId === userId;

  useEffect(() => {
    if (pendingCount && isMe && isPrivateNetwork) {
      setAllTabs(
        Object.values(FollowersTabs)
          .map(value => ({
            value,
            label: value,
          }))
          .concat({
            value: PENDING_TAB,
            label: `${formatMessage({ id: 'tabs.pending' })} (${pendingCount})`,
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
  }, [pendingCount]);

  return (
    <div>
      <StyledTabs tabs={allTabs} activeTab={activeTab} onChange={setActiveTab} />
      <ConditionalRender condition={activeTab === FollowersTabs.FOLLOWINGS}>
        <FollowingsList
          currentUserId={currentUserId}
          profileUserId={userId}
          setUserFeedTab={setUserFeedTab}
        />
      </ConditionalRender>
      <ConditionalRender condition={activeTab === FollowersTabs.FOLLOWERS}>
        <FollowersList
          currentUserId={currentUserId}
          profileUserId={userId}
          setUserFeedTab={setUserFeedTab}
        />
      </ConditionalRender>
      <ConditionalRender condition={activeTab.includes(PENDING_TAB) && isMe && isPrivateNetwork}>
        <PendingList />
      </ConditionalRender>
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
