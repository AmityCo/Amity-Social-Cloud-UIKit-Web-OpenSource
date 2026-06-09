import { useState } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useChannelMembersCollection } from '~/v4/chat/hooks/collections/useChannelMembersCollection';
import { EmptyState } from '~/v4/chat/features/shared/components/EmptyState/EmptyState';
import { MemberItem } from '~/v4/chat/features/group/members/components/MemberItem';
import { LIST_PAGE_LIMIT, LIST_SKELETON_ROW_COUNT } from '~/v4/chat/constants';
import type { OpenUnbanActionParams } from '~/v4/chat/features/group/banned-members/hooks/useBannedGroupMembers';
import styles from './BannedMemberList.module.css';

type BannedMemberListProps = {
  channelId: string;
  search: string;
  onOpenUnbanAction: (params: OpenUnbanActionParams) => void;
};

export function BannedMemberList({ channelId, search, onOpenUnbanAction }: BannedMemberListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  const { members, isLoadingFirstPage, isLoading, hasMore, loadMore } = useChannelMembersCollection(
    {
      channelId,
      search,
      memberships: ['banned'],
      limit: LIST_PAGE_LIMIT,
    },
  );

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  if (members.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-banned-users" />;
  }

  return (
    <div className={styles.bannedMemberList}>
      {members.map((member) => {
        if (!member.user || !member.userId) return null;
        return (
          <MemberItem
            key={member.userId}
            user={member.user}
            isModerator={false}
            isCurrentUser={false}
            onActionPress={() => onOpenUnbanAction({ user: member.user! })}
          />
        );
      })}
      {(isLoading || isLoadingFirstPage) &&
        Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <MemberItem.Skeleton key={`skeleton-${i}`} />
        ))}
      {hasMore && !isLoadingFirstPage && !isLoading && (
        <div ref={(node) => setSentinelNode(node)} />
      )}
    </div>
  );
}
