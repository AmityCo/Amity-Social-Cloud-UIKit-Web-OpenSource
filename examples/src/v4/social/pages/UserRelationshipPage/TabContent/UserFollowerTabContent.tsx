import React, { FC } from 'react';
import useFollowersCollection from '~/v4/core/hooks/collections/useFollowersCollection';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import { UserRelationshipList } from './UserRelationshipList';

type UserFollowerTabContentProps = {
  userId: string;
  pageId?: string;
  componentId?: string;
};

export const UserFollowerTabContent: FC<UserFollowerTabContentProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
}) => {
  const { followers, hasMore, loadMore, isLoading } = useFollowersCollection({
    userId,
    status: 'accepted',
  });

  return (
    <UserRelationshipList
      relationships={followers}
      type={UserRelationshipPageTabs.FOLLOWER}
      pageId={pageId}
      componentId={componentId}
      hasMore={hasMore}
      loadMore={loadMore}
      isLoading={isLoading}
    />
  );
};
