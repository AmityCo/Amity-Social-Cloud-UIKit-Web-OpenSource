import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { FollowRequestStatus } from '@amityco/js-sdk';

import { ButtonsContainer, UserHeaderContainer } from '~/social/pages/UserFeed/Followers/styles';
import UserHeader from '~/social/components/UserHeader';
import useFollow from '~/core/hooks/useFollow';
import Button, { PrimaryButton } from '~/core/components/Button';
import withSDK, { useSDK } from '~/core/hocs/withSDK';
import { notification } from '~/core/components/Notification';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import useFollowersList from '~/core/hooks/useFollowersList';
import PaginatedList from '~/core/components/PaginatedList';
import { Grid } from '~/social/components/community/CategoryCommunitiesList/styles';
import Skeleton from '~/core/components/Skeleton';

const PendingItem = ({ currentUserId, userId }) => {
  const { followAccept, deleteFollower } = useFollow(currentUserId, userId);
  const { connected } = useSDK();

  const [onFollowAccept] = useAsyncCallback(async () => {
    await followAccept();
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [followAccept]);

  const [onFollowDecline] = useAsyncCallback(async () => {
    await deleteFollower();
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [deleteFollower]);

  return (
    <UserHeaderContainer>
      <UserHeader userId={userId} />
      <ButtonsContainer>
        <PrimaryButton fullWidth disabled={!connected} onClick={onFollowAccept}>
          <FormattedMessage id="request.accept" />
        </PrimaryButton>
        <Button fullWidth disabled={!connected} onClick={onFollowDecline}>
          <FormattedMessage id="request.decline" />
        </Button>
      </ButtonsContainer>
    </UserHeaderContainer>
  );
};

const PendingList = ({ currentUserId }) => {
  const [pendingUsers, hasMore, loadMore, loading, loadingMore] = useFollowersList(
    currentUserId,
    FollowRequestStatus.Pending,
  );

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ userId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return pendingUsers;
    }

    return [...pendingUsers, ...getLoadingItems()];
  }, [pendingUsers, loading, loadingMore]);

  return (
    <PaginatedList items={items} hasMore={hasMore} loadMore={loadMore} container={Grid}>
      {({ skeleton, userId }) =>
        skeleton ? (
          <Skeleton count={3} style={{ fontSize: 8 }} />
        ) : (
          <PendingItem key={userId} userId={userId} currentUserId={currentUserId} />
        )
      }
    </PaginatedList>
  );
};

export default withSDK(PendingList);
