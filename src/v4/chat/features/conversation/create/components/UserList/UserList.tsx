import { useState } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useSearchUserByDisplayName } from '~/v4/core/hooks/collections/useSearchUserByDisplayName';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { EmptyState } from '~/v4/chat/features/shared/components';
import { UserItem } from '~/v4/chat/features/conversation/create/components/UserItem/UserItem';
import {
  LIST_PAGE_LIMIT,
  LIST_SKELETON_ROW_COUNT,
  SEARCH_MIN_QUERY_LENGTH,
} from '~/v4/chat/constants';
import styles from './UserList.module.css';

type UserListProps = {
  searchText: string;
  onSelectUser: (user: Amity.User) => void;
};

export function UserList({ searchText, onSelectUser }: UserListProps) {
  const { currentUserId } = useSDK();
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  const trimmed = searchText.trim();
  const isPartialQuery = trimmed.length > 0 && trimmed.length < SEARCH_MIN_QUERY_LENGTH;

  const { users, isLoadingFirstPage, isLoading, hasMore, loadMore } = useSearchUserByDisplayName(
    {
      limit: LIST_PAGE_LIMIT,
      displayName: searchText,
      matchType: 'partial',
    },
    { shouldCall: !isPartialQuery },
  );

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  if (isPartialQuery) {
    return <EmptyState variant="prompt" />;
  }

  const visibleUsers = users.filter((user) => user.userId !== currentUserId);

  if (visibleUsers.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-results" />;
  }

  return (
    <div className={styles.userList}>
      {visibleUsers.map((user) => (
        <UserItem key={user.userId} user={user} onPress={onSelectUser} />
      ))}
      {(isLoadingFirstPage || isLoading) &&
        Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <UserItem.Skeleton key={i} />
        ))}
      {hasMore && !isLoadingFirstPage && !isLoading && (
        <div ref={(node) => setSentinelNode(node)} />
      )}
    </div>
  );
}
