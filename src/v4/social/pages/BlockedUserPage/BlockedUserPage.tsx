import React, { useEffect, useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { Title } from '~/v4/social/elements/Title';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './BlockedUserPage.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';
import { List } from '~/v4/icons/List';
import { UserListSkeleton } from '~/v4/core/components/UserListSkeleton';
import useBlockedUsersCollection from '~/v4/social/hooks/collections/useBlockedUsersCollection';
import { BlockedUserItem } from './BlockedUserItem/BlockedUserItem';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

export const BlockedUserPage = () => {
  const pageId = 'blocked_users_page';

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { onBack } = useNavigation();
  const { users, isLoading, hasMore, loadMore, refresh } = useBlockedUsersCollection({});

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

  useEffect(() => {
    refresh();
  }, []);

  const renderSkeleton = () => {
    return (
      <div className={styles.blockedUserPage__skeletionContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <UserListSkeleton key={index} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.blockedUserPage} style={themeStyles} data-testid={accessibilityId}>
      <div className={styles.blockedUserPage__topBar}>
        <BackButton pageId={pageId} onPress={() => onBack()} />
        <Title pageId={pageId} titleClassName={styles.blockedUserPage__topBar__text} />
      </div>
      {!isLoading && users.length === 0 ? (
        <div className={styles.blockedUserPage__emptyContent}>
          <EmptyContent
            pageId={pageId}
            defaultIcon={() => <List className={styles.blockedUserPage__emptyContent__icon} />}
            text="Nothing here to see yet"
          />
        </div>
      ) : (
        <div className={styles.blockedUserPage__content}>
          {users && users.length > 0 && (
            <>
              <div className={styles.blockedUserPage__blockedList}>
                {users.map((user) => {
                  return <BlockedUserItem key={user.userId} user={user} pageId={pageId} />;
                })}
              </div>
              {hasMore && (
                <div
                  ref={(node) => setIntersectionNode(node)}
                  className={styles.blockedUserPage__intersectionNode}
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
