import { useState } from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';
import { Selection } from '~/v4/core/design/atoms/Selection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useSearchUserByDisplayName } from '~/v4/core/hooks/collections/useSearchUserByDisplayName';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { EmptyState } from '~/v4/chat/features/shared/components';
import { UserItem } from '~/v4/chat/features/group/select-member/components/UserItem/UserItem';
import {
  LIST_PAGE_LIMIT,
  LIST_SKELETON_ROW_COUNT,
  SEARCH_MIN_QUERY_LENGTH,
} from '~/v4/chat/constants';
import styles from './UserList.module.css';

type UserListProps = {
  searchText: string;
  selectedUsers: Amity.User[];
  onChange: (users: Amity.User[]) => void;
};

export function UserList({ searchText, selectedUsers, onChange }: UserListProps) {
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

  const userIndex = new Map<string, Amity.User>();
  selectedUsers.forEach((user) => userIndex.set(user.userId, user));
  visibleUsers.forEach((user) => userIndex.set(user.userId, user));

  function handleChange(nextIds: string[]) {
    const nextUsers = nextIds
      .map((id) => userIndex.get(id))
      .filter((user): user is Amity.User => !!user);
    onChange(nextUsers);
  }

  return (
    <div className={styles.userList}>
      <AriaCheckboxGroup
        aria-label="Select members"
        value={selectedUsers.map((user) => user.userId)}
        onChange={handleChange}
      >
        {visibleUsers.map((user) => (
          <Selection.Checkbox
            key={user.userId}
            value={user.userId}
            className={styles.userList__row}
          >
            <UserItem user={user} />
          </Selection.Checkbox>
        ))}
      </AriaCheckboxGroup>
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
