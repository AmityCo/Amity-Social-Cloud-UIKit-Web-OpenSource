import React, { FC } from 'react';
import useFollowingsCollection from '~/v4/core/hooks/collections/useFollowingsCollection';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import { UserRelationshipList } from './UserRelationshipList';

type UserFollowingTabContentProps = {
  userId: string;
  pageId?: string;
  componentId?: string;
};

export const UserFollowingTabContent: FC<UserFollowingTabContentProps> = ({
  userId,
  pageId = '*',
  componentId = '*',
}) => {
  const { followings, hasMore, loadMore, isLoading } = useFollowingsCollection({
    userId,
    status: 'accepted',
  });

  return (
    <UserRelationshipList
      relationships={followings}
      type={UserRelationshipPageTabs.FOLLOWING}
      pageId={pageId}
      componentId={componentId}
      hasMore={hasMore}
      loadMore={loadMore}
      isLoading={isLoading}
    />
  );
};
