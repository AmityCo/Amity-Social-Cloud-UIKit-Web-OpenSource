import React, { useEffect, useState } from 'react';
import styles from './BlockedUserSetting.module.css';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useBlockedUsersCollection from '~/v4/social/hooks/collections/useBlockedUsersCollection';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import { List } from '~/v4/icons/List';
import { BlockedUserItem } from '~/v4/social/pages/BlockedUserPage/BlockedUserItem';
import { UserListSkeleton } from '~/v4/core/components/UserListSkeleton';

const BlockedUserSetting: React.FC = () => {
  const pageId = 'blocked_users_settings';

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { users, isLoading, hasMore, loadMore, refresh } = useBlockedUsersCollection({});

  const renderSkeleton = () => {
    return (
      <div className={styles.blockedUserSetting__skeletionContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <UserListSkeleton key={index} />
        ))}
      </div>
    );
  };
  useIntersectionObserver({
    onIntersect: () => {
      if (isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });
  return (
    <div className={styles.container}>
      {!isLoading && users.length === 0 ? (
        <div className={styles.blockedUserSetting__emptyContent}>
          <EmptyContent
            pageId={pageId}
            defaultIcon={() => <List className={styles.blockedUserSetting__emptyContent__icon} />}
            text="Nothing here to see yet"
          />
        </div>
      ) : (
        <div className={styles.blockedUserSetting__content}>
          {users && users.length > 0 && (
            <>
              <div className={styles.blockedUserSetting__blockedList}>
                {users.map((user) => {
                  return <BlockedUserItem key={user.userId} user={user} pageId={pageId} />;
                })}
              </div>
              {hasMore && (
                <div
                  ref={(node) => setIntersectionNode(node)}
                  className={styles.blockedUserSetting__intersectionNode}
                />
              )}
            </>
          )}
          {isLoading && renderSkeleton()}
        </div>
      )}
    </div>
  );
};

export default BlockedUserSetting;
