import React, { useState } from 'react';
import styles from './UserRelationshipList.module.css';
import { UserItem } from './UserItem';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import { UserListSkeleton } from '~/v4/core/components/UserListSkeleton/UserListSkeleton';
import { List } from '~/v4/icons/List';
import { Typography } from '~/v4/core/components';

type UserRelationshipListProps = {
  pageId?: string;
  componentId?: string;
  relationships?: Amity.RawFollowStatus[];
  type: UserRelationshipPageTabs;
  hasMore?: boolean;
  isLoading?: boolean;
  loadMore?: () => void;
};

export const UserRelationshipList: React.FC<UserRelationshipListProps> = ({
  pageId = '*',
  componentId = '*',
  relationships,
  hasMore = false,
  isLoading = false,
  type,
  loadMore,
}) => {
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const renderSkeleton = () => {
    return (
      <div className={styles.userRelationshipList__skeletonContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <UserListSkeleton key={index} />
        ))}
      </div>
    );
  };

  useIntersectionObserver({
    onIntersect: () => {
      if (isLoading === false) {
        loadMore?.();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  return (
    <div className={styles.userRelationshipList__container}>
      {!isLoading && relationships?.length === 0 ? (
        <div className={styles.userRelationshipList__emptyContainer}>
          <List className={styles.userRelationshipList__emptyIcon} />
          <Typography.TitleBold className={styles.userRelationshipList__emptyText}>
            Nothing here to see yet
          </Typography.TitleBold>
        </div>
      ) : (
        <>
          {relationships?.map((relationship) => {
            const userId =
              relationship[type === UserRelationshipPageTabs.FOLLOWING ? 'to' : 'from'];
            return (
              <UserItem key={userId} userId={userId} pageId={pageId} componentId={componentId} />
            );
          })}
        </>
      )}
      {isLoading && renderSkeleton()}
      {hasMore && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.userRelationshipList__observerTarget}
        />
      )}
    </div>
  );
};
