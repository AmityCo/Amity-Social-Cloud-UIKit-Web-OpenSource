import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { ButtonsContainer, UserHeaderContainer } from '~/social/pages/UserFeed/Followers/styles';
import UserHeader from '~/social/components/UserHeader';
import Button, { PrimaryButton } from '~/core/components/Button';
import { Grid } from '~/social/components/community/CategoryCommunitiesList/styles';
import Skeleton from '~/core/components/Skeleton';
import LoadMore from '~/core/components/LoadMore';
import { UserRepository } from '@amityco/ts-sdk';
import { isLoadingItem } from '~/utils';
import useFollowersCollection from '~/core/hooks/collections/useFollowersCollection';
import { useNotifications } from '~/core/providers/NotificationProvider';

const PendingItem = ({ userId }: { userId: string }) => {
  const notification = useNotifications();

  const followAccept = async () => {
    if (!userId) return;
    await UserRepository.Relationship.acceptMyFollower(userId);
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  };
  const deleteFollower = async () => {
    if (!userId) return;
    await UserRepository.Relationship.declineMyFollower(userId);
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  };

  return (
    <UserHeaderContainer>
      <UserHeader userId={userId} />
      <ButtonsContainer>
        <PrimaryButton fullWidth onClick={followAccept}>
          <FormattedMessage id="request.accept" />
        </PrimaryButton>
        <Button fullWidth onClick={deleteFollower}>
          <FormattedMessage id="request.decline" />
        </Button>
      </ButtonsContainer>
    </UserHeaderContainer>
  );
};

const PendingList = ({ userId }: { userId?: string | null }) => {
  const {
    followers: pendingUsers,
    hasMore,
    loadMore,
    isLoading,
    loadMoreHasBeenCalled,
  } = useFollowersCollection({
    userId,
    status: 'pending',
  });

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ userId: index, skeleton: true }));
    }

    if (isLoading && !loadMoreHasBeenCalled) {
      return getLoadingItems();
    }

    if (isLoading && loadMoreHasBeenCalled) {
      return [...pendingUsers, ...getLoadingItems()];
    }
    return pendingUsers;
  }, [pendingUsers, isLoading, loadMoreHasBeenCalled]);

  const renderLoadMore = () => {
    if (!hasMore) return null;

    return <LoadMore onClick={() => loadMore()} />;
  };

  if (items.length === 0) {
    return (
      <>
        <Grid>{null}</Grid>
        {renderLoadMore()}
      </>
    );
  }

  return (
    <>
      <Grid>
        {items.map((item) =>
          isLoadingItem(item) ? (
            <Skeleton style={{ fontSize: 8 }} />
          ) : (
            <PendingItem key={`${item.from}-${item.to}`} userId={item.to} />
          ),
        )}
      </Grid>
      {renderLoadMore()}
    </>
  );
};

export default PendingList;
