import { FormattedMessage, useIntl } from 'react-intl';
import React, { useCallback, useMemo } from 'react';

import LoadMore from '~/core/components/LoadMore';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import Skeleton from '~/core/components/Skeleton';
import { isLoadingItem } from '~/utils';
import useUser from '~/core/hooks/useUser';
import { UserRepository } from '@amityco/ts-sdk';
import { useNavigation } from '~/social/providers/NavigationProvider';

import {
  Grid,
  Header,
  ListEmptyState,
  UserHeaderContainer,
} from '~/social/pages/UserFeed/Followers/styles';
import UserHeader from '~/social/components/UserHeader';
import OptionMenu from '~/core/components/OptionMenu';
import useUserFlaggedByMe from '~/social/hooks/useUserFlaggedByMe';
import useFollowingsSubscription from '~/social/hooks/useFollowingsSubscription';
import useSDK from '~/core/hooks/useSDK';
import useFollowingsCollection from '~/core/hooks/collections/useFollowingsCollection';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';

interface UserItemProps {
  profileUserId: string;
  currentUserId?: string | null;
  userId: string;
  onClick: () => void;
}

export const UserItem = ({ profileUserId, currentUserId, userId, onClick }: UserItemProps) => {
  const user = useUser(userId);
  const { onClickUser } = useNavigation();
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const { formatMessage } = useIntl();
  const { isFlaggedByMe, toggleFlagUser } = useUserFlaggedByMe(userId);

  const onReportClick = async () => {
    await toggleFlagUser();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  const unfollow = () => UserRepository.Relationship.unfollow(userId);

  const isMyProfile = profileUserId === currentUserId;
  const isMe = currentUserId === userId;

  const onRemoveClick = () => {
    const title = user?.displayName
      ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
      : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

    const content = user?.displayName
      ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
      : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });
    confirm({
      title,
      content,
      cancelText: formatMessage({ id: 'buttonText.cancel' }),
      okText: formatMessage({ id: 'buttonText.unfollow' }),
      onOk: unfollow,
    });
  };

  const onClickUserHeader = useCallback(() => {
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
        name: formatMessage({ id: 'follower.menuItem.unfollow' }),
        action: onRemoveClick,
      });
    }
    return opts;
  }, [isFlaggedByMe, isMyProfile, isMe, onRemoveClick, onReportClick]);

  return (
    <UserHeaderContainer key={userId}>
      <Header>
        <UserHeader userId={userId} onClick={onClickUserHeader} />
        <OptionMenu options={options} />
      </Header>
    </UserHeaderContainer>
  );
};

function useFollowingsListItems({ userId }: { userId?: string | null }) {
  const { followings, isLoading, loadMore, hasMore, loadMoreHasBeenCalled } =
    useFollowingsCollection({
      userId: userId,
      status: 'all',
    });

  useFollowingsSubscription({
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
      return [...followings, ...getLoadingItems()];
    }
    return followings;
  }, [followings, isLoading, loadMoreHasBeenCalled]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    loadMoreHasBeenCalled,
  };
}

interface FollowingsListProps {
  userId: string;
  onItemClick: (userId: string) => void;
}

const FollowingsList = ({ userId, onItemClick }: FollowingsListProps) => {
  const { formatMessage } = useIntl();
  const { currentUserId } = useSDK();
  const { items, loadMore, hasMore } = useFollowingsListItems({
    userId,
  });

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
            description={formatMessage({ id: 'follow.placeholder.noFollowings' })}
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
              userId={item.to}
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

export default FollowingsList;
