import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { StyledTabs } from './styles';

import FollowingsList from '~/social/pages/UserFeed/Followers/FollowingsList';
import FollowersList from '~/social/pages/UserFeed/Followers/FollowersList';
import PendingList from '~/social/pages/UserFeed/Followers/PendingList';
import { FollowersTabs, PENDING_TAB } from '~/social/pages/UserFeed/Followers/utils';
import useSDK from '~/core/hooks/useSDK';
import * as utils from '~/helpers/utils';
import useFollowersCollection from '~/core/hooks/collections/useFollowersCollection';

interface FollowersProps {
  userId: string;
  activeTab: string;
  socialSettings: Amity.SocialSettings | null;
  onTabChange: (tab: string) => void;
  onFollowingListClick: (userId: string) => void;
  onFollowerListClick: (userId: string) => void;
}

const Followers = ({
  userId,
  activeTab,
  socialSettings,
  onTabChange,
  onFollowingListClick,
  onFollowerListClick,
}: FollowersProps) => {
  const { currentUserId } = useSDK();

  const isPrivateNetwork = utils.isPrivateNetwork(socialSettings);

  const { formatMessage } = useIntl();
  const [allTabs, setAllTabs] = useState(
    Object.values(FollowersTabs).map((value) => ({
      value,
      label: value,
    })),
  );

  const { followers: pendingUsers } = useFollowersCollection({
    userId,
    status: 'pending',
  });

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

      // onTabChange(FollowersTabs.FOLLOWINGS);
    }
  }, [formatMessage, isMe, pendingUsers, onTabChange]);

  return (
    <div>
      <StyledTabs tabs={allTabs} activeTab={activeTab} onChange={onTabChange} />

      {activeTab === FollowersTabs.FOLLOWINGS && (
        <FollowingsList userId={userId} onItemClick={(userId) => onFollowingListClick(userId)} />
      )}

      {activeTab === FollowersTabs.FOLLOWERS && (
        <FollowersList userId={userId} onItemClick={(userId) => onFollowerListClick(userId)} />
      )}

      {activeTab.includes(PENDING_TAB) && isMe && <PendingList userId={userId} />}
    </div>
  );
};

export default Followers;
