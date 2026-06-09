import { useState, useMemo } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useChannelMembersCollection } from '~/v4/chat/hooks/collections/useChannelMembersCollection';
import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { EmptyState } from '~/v4/chat/features/shared/components';
import { MemberItem } from '~/v4/chat/features/group/members/components/MemberItem';
import { LIST_PAGE_LIMIT, LIST_SKELETON_ROW_COUNT } from '~/v4/chat/constants';
import { MemberRoles } from '~/v4/chat/constants/memberRoles';
import type { OpenMemberActionsParams } from '~/v4/chat/features/group/members/hooks/useGroupMembers';
import styles from './MemberList.module.css';

type MemberListProps = {
  channelId: string;
  search: string;
  onlyModerators: boolean;
  currentUserId: string | null | undefined;
  onOpenMemberActions: (params: OpenMemberActionsParams) => void;
};

export function MemberList({
  channelId,
  search,
  onlyModerators,
  currentUserId,
  onOpenMemberActions,
}: MemberListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  const {
    members: channelMembers,
    isLoadingFirstPage,
    isLoading,
    hasMore,
    loadMore,
  } = useChannelMembersCollection({
    channelId,
    search,
    memberships: ['member', 'muted'],
    roles: onlyModerators ? [MemberRoles.CHANNEL_MODERATOR] : undefined,
    limit: LIST_PAGE_LIMIT,
  });

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  const members = useMemo(
    () => channelMembers.filter((m) => !m.user?.isGlobalBanned),
    [channelMembers],
  );

  const orderedMembers = useMemo(() => {
    if (!currentUserId) return members;
    const selfIndex = members.findIndex((m) => m.userId === currentUserId);
    if (selfIndex === -1) return members;
    const self = members[selfIndex];
    if (onlyModerators && !hasModeratorRole(self.roles)) return members;
    const rest = members.filter((m) => m.userId !== currentUserId);
    return [self, ...rest];
  }, [members, currentUserId, onlyModerators]);

  const { channel } = useChannelObject({ channelId });
  const { membership } = useChannelMyMembership(channel);
  const isViewerModerator = hasModeratorRole(membership?.roles);

  if (orderedMembers.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-members" />;
  }

  return (
    <div className={styles.memberList}>
      {orderedMembers.map((member) => {
        if (!member.user || !member.userId) return null;
        const isCurrentUser = member.userId === currentUserId;
        const isMemberModerator = hasModeratorRole(member.roles);
        const showActions = !isCurrentUser;
        return (
          <MemberItem
            key={member.userId}
            user={member.user}
            isModerator={isMemberModerator}
            isCurrentUser={isCurrentUser}
            isMuted={!!member.isMuted}
            isViewerModerator={isViewerModerator}
            onActionPress={
              showActions
                ? () =>
                    onOpenMemberActions({
                      user: member.user!,
                      isTargetModerator: isMemberModerator,
                      isTargetMuted: !!member.isMuted,
                    })
                : undefined
            }
          />
        );
      })}
      {(isLoadingFirstPage || isLoading) &&
        Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <MemberItem.Skeleton key={`skeleton-${i}`} />
        ))}
      {hasMore && !isLoadingFirstPage && !isLoading && (
        <div ref={(node) => setSentinelNode(node)} />
      )}
    </div>
  );
}
