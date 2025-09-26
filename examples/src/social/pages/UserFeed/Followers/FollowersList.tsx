import { FormattedMessage, useIntl } from 'react-intl';
import React, { useCallback, useEffect, useMemo } from 'react';

import LoadMore from '~/core/components/LoadMore';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import Skeleton from '~/core/components/Skeleton';
import { isLoadingItem } from '~/utils';

import { UserRepository } from '@amityco/ts-sdk';
import { useNavigation } from '~/social/providers/NavigationProvider';

import {
  Grid,
  Header,
  ListEmptyState,
  UserHeaderContainer,
} from '~/social/pages/UserFeed/Followers/styles';
import UIUserHeader from '~/social/components/UserHeader/UIUserHeader';
import OptionMenu from '~/core/components/OptionMenu';
import useImage from '~/core/hooks/useImage';
import useUserFlaggedByMe from '~/social/hooks/useUserFlaggedByMe';
import useFollowersSubscription from '~/social/hooks/useFollowersSubscription';
import useSDK from '~/core/hooks/useSDK';
import useFollowersCollection from '~/core/hooks/collections/useFollowersCollection';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';

interface UserItemProps {
  profileUserId: string;
  currentUserId?: string | null;
  userId?: string | null;
  onClick: () => void;
}

export const UserItem = ({ profileUserId, currentUserId, userId, onClick }: UserItemProps) => {
  const { user, refresh } = useUser({ userId });
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { onClickUser } = useNavigation();
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { formatMessage } = useIntl();
  const { isFlaggedByMe, toggleFlagUser } = useUserFlaggedByMe(userId || undefined);

  useEffect(() => {
    refresh();
  }, []);

  const onReportClick = async () => {
    await toggleFlagUser();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  const deleteFollower = () => {
    if (!userId) return;
    UserRepository.Relationship.declineMyFollower(userId);
  };

  const isMyProfile = profileUserId === currentUserId;
  const isMe = currentUserId === userId;

  const onRemoveClick = () => {
    confirm({
      title: (
        <FormattedMessage
          id="follower.title.removeUser"
          values={{ displayName: user?.displayName }}
        />
      ),
      content: (
        <FormattedMessage
          id="follower.body.removeUser"
          values={{ displayName: user?.displayName }}
        />
      ),
      cancelText: formatMessage({ id: 'buttonText.cancel' }),
      okText: formatMessage({ id: 'buttonText.remove' }),
      onOk: deleteFollower,
    });
  };

  const onClickUserHeader = useCallback(() => {
    if (userId == null) return;
    onClickUser(userId);
  }, [onClickUser, userId]);

  const options = useMemo(() => {
    const opts: { name: string; action: () => void | Promise<void> }[] = [];
    if (!isMe) {
      opts.push({
        name: isFlaggedByMe
          ? formatMessage({ id: 'report.unreportUser' })
          : formatMessage({ id: 'report.reportUser' }),
        action: onReportClick,
      });
    }
    if (isMyProfile) {
      opts.push({
        name: formatMessage({ id: 'follower.menuItem.removeUser' }),
        action: onRemoveClick,
      });
    }
    return opts;
  }, [isFlaggedByMe, isMyProfile, isMe, onRemoveClick, onReportClick]);

  return (
    <UserHeaderContainer key={userId}>
      <Header>
        <UIUserHeader
          userId={user?.userId}
          displayName={user?.displayName}
          avatarFileUrl={avatarFileUrl}
          onClick={onClickUserHeader}
        />
        <OptionMenu options={options} />
      </Header>
    </UserHeaderContainer>
  );
};

function useFollowerListItems({ userId }: { userId?: string | null }) {
  const { followers, isLoading, loadMore, hasMore, loadMoreHasBeenCalled } = useFollowersCollection(
    {
      userId,
      status: 'accepted',
    },
  );

  useFollowersSubscription({
    userId,
  });

  const items: (Amity.FollowStatus | { skeleton?: boolean })[] = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ skeleton: true }));
    }

    if (isLoading && !loadMoreHasBeenCalled) {
      return getLoadingItems();
    }

    if (isLoading && loadMoreHasBeenCalled) {
      return [...followers, ...getLoadingItems()];
    }
    return followers;
  }, [followers, isLoading, loadMoreHasBeenCalled]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    loadMoreHasBeenCalled,
  };
}

interface FollowersListProps {
  userId: string;
  onItemClick: (userId: string) => void;
}

const FollowersList = ({ userId, onItemClick }: FollowersListProps) => {
  const { formatMessage } = useIntl();
  const { items, loadMore, hasMore } = useFollowerListItems({ userId });
  const { currentUserId } = useSDK();

  const renderLoadMore = () => {
    if (!hasMore) return null;

    return <LoadMore onClick={() => loadMore?.()} />;
  };

  if (items.length === 0) {
    return (
      <>
        <Grid>
          <ListEmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title="It's empty here..."
            description={formatMessage({ id: 'follow.placeholder.noFollowers' })}
          />
        </Grid>
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
            <UserItem
              key={`${item.from}-${item.to}`}
              userId={item.from}
              profileUserId={userId}
              currentUserId={currentUserId}
              onClick={() => onItemClick(item.to)}
            />
          ),
        )}
      </Grid>
      {renderLoadMore()}
    </>
  );
};

export default FollowersList;
