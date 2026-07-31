import { useState, useMemo } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useChannelMembersCollection } from '~/v4/chat/hooks/collections/useChannelMembersCollection';
import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { EmptyState } from '~/v4/chat/features/shared/components';
import { MemberItem } from '~/v4/chat/features/group/members/components/MemberItem';
import { LIST_PAGE_LIMIT, LIST_SKELETON_ROW_COUNT } from '~/v4/chat/constants';
import { MemberRoles } from '~/v4/chat/constants/memberRoles';
import { ActionMenuItem } from '~/v4/chat/components/ActionMenu';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { Trash } from '~/v4/core/design/icons/Trash';
import { UserShield } from '~/v4/core/design/icons/UserShield';
import { Ban } from '~/v4/core/design/icons/Ban';
import { VolumeSlash } from '~/v4/core/design/icons/VolumeSlash';
import { Volume } from '~/v4/core/design/icons/Volume';
import { Flag } from '~/v4/core/design/icons/Flag';
import {
  useChannelBanQuery,
  useChannelMemberMuteQuery,
  useChannelMembershipQuery,
  useChannelModerationQuery,
  useUserReportQuery,
} from '~/v4/chat/hooks/queries';
import styles from './MemberList.module.css';

type MemberListProps = {
  channelId: string;
  search: string;
  onlyModerators: boolean;
};

export function MemberList({ channelId, search, onlyModerators }: MemberListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { success } = useNotifications('chat');
  const { promoteModerator, demoteModerator } = useChannelModerationQuery();
  const { removeMembers } = useChannelMembershipQuery();
  const { banUser } = useChannelBanQuery();
  const { mute, unmute } = useChannelMemberMuteQuery();
  const { report, unreport, queryIsFlaggedByMe } = useUserReportQuery();
  const { channel } = useChannelObject({ channelId });
  const { membership } = useChannelMyMembership(channel);
  const isViewerModerator = hasModeratorRole(membership?.roles);

  const muteLabel = useString('amity_chat_group_member_action_mute');
  const unmuteLabel = useString('amity_chat_group_member_action_unmute');
  const reportLabel = useString('amity_chat_member_action_report');
  const unreportLabel = useString('amity_chat_member_action_unreport');
  const promoteLabel = useString('amity_chat_member_action_promote');
  const demoteLabel = useString('amity_chat_member_action_demote');
  const banLabel = useString('amity_chat_user_action_ban');
  const removeLabel = useString('amity_chat_member_action_remove');
  const cancelLabel = useString('amity_chat_cancel');
  const promoteAlertTitle = useString('amity_chat_group_member_list_promote_title');
  const promoteAlertMessage = useString('amity_chat_group_member_list_promote_message');
  const promoteAlertConfirm = useString('amity_chat_group_member_list_promote_confirm');
  const demoteAlertTitle = useString('amity_chat_group_member_list_demote_title');
  const demoteAlertMessage = useString('amity_chat_group_member_list_demote_message');
  const demoteAlertConfirm = useString('amity_chat_group_member_list_demote_confirm');
  const removeAlertTitle = useString('amity_chat_group_member_list_remove_title');
  const removeAlertMessage = useString('amity_chat_group_member_list_remove_message');
  const removeAlertConfirm = useString('amity_chat_group_member_list_remove_confirm');
  const banAlertTitle = useString('amity_chat_ban_confirm_title');
  const banAlertMessage = useString('amity_chat_ban_confirm_message');
  const banAlertConfirm = useString('amity_chat_ban_confirm_label');
  const promoteSuccessToast = useString('amity_chat_group_member_list_toast_promoted');
  const demoteSuccessToast = useString('amity_chat_group_member_list_toast_demoted');
  const removeSuccessToast = useString('amity_chat_action_remove_member');
  const banSuccessToast = useString('amity_chat_group_member_list_toast_banned');

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

  function handlePromoteConfirm(user: Amity.User) {
    confirm({
      title: promoteAlertTitle,
      content: promoteAlertMessage,
      okText: promoteAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'primary',
      onOk: async () => {
        await promoteModerator({ channelId, userIds: [user.userId] });
        success({ content: promoteSuccessToast, alignment: 'fullscreen' });
      },
    });
  }

  function handleDemoteConfirm(user: Amity.User) {
    confirm({
      title: demoteAlertTitle,
      content: demoteAlertMessage,
      okText: demoteAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await demoteModerator({ channelId, userIds: [user.userId] });
        success({ content: demoteSuccessToast, alignment: 'fullscreen' });
      },
    });
  }

  function handleRemoveConfirm(user: Amity.User) {
    confirm({
      title: removeAlertTitle,
      content: removeAlertMessage,
      okText: removeAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await removeMembers({ channelId, userIds: [user.userId] });
        success({ content: removeSuccessToast, alignment: 'fullscreen' });
      },
    });
  }

  function handleBanConfirm(user: Amity.User) {
    confirm({
      title: banAlertTitle,
      content: banAlertMessage,
      okText: banAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await banUser({ channelId, userIds: [user.userId] });
        success({ content: banSuccessToast, alignment: 'fullscreen' });
      },
    });
  }

  if (orderedMembers.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-members" />;
  }

  return (
    <div className={styles.memberList}>
      {orderedMembers.map((member) => {
        if (!member.user || !member.userId) return null;
        const isCurrentUser = member.userId === currentUserId;
        const isMemberModerator = hasModeratorRole(member.roles);

        const getActions = isCurrentUser
          ? undefined
          : async () => {
              const isFlaggedByMe = await queryIsFlaggedByMe(member.user!.userId);

              const items: (ActionMenuItem & { visible: boolean })[] = [
                {
                  key: 'promote',
                  icon: UserShield,
                  label: promoteLabel,
                  onPress: () => handlePromoteConfirm(member.user!),
                  visible: isViewerModerator && !isMemberModerator,
                },
                {
                  key: 'demote',
                  icon: UserShield,
                  label: demoteLabel,
                  onPress: () => handleDemoteConfirm(member.user!),
                  visible: isViewerModerator && isMemberModerator,
                },
                {
                  key: 'mute',
                  icon: VolumeSlash,
                  label: muteLabel,
                  onPress: () => mute({ channelId, userId: member.user!.userId }),
                  visible: isViewerModerator && !member.isMuted && !isMemberModerator,
                },
                {
                  key: 'unmute',
                  icon: Volume,
                  label: unmuteLabel,
                  onPress: () => unmute({ channelId, userId: member.user!.userId }),
                  visible: isViewerModerator && !!member.isMuted && !isMemberModerator,
                },
                {
                  key: 'report',
                  icon: Flag,
                  label: reportLabel,
                  onPress: () => report(member.user!.userId),
                  visible: !isFlaggedByMe,
                },
                {
                  key: 'unreport',
                  icon: Flag,
                  label: unreportLabel,
                  onPress: () => unreport(member.user!.userId),
                  visible: isFlaggedByMe,
                },
                {
                  key: 'ban',
                  icon: Ban,
                  label: banLabel,
                  onPress: () => handleBanConfirm(member.user!),
                  visible: isViewerModerator,
                },
                {
                  key: 'remove',
                  icon: Trash,
                  label: removeLabel,
                  destructive: true,
                  onPress: () => handleRemoveConfirm(member.user!),
                  visible: isViewerModerator,
                },
              ];

              return items.filter((item) => item.visible);
            };

        return (
          <MemberItem
            key={member.userId}
            user={member.user}
            isModerator={isMemberModerator}
            isCurrentUser={isCurrentUser}
            isMuted={!!member.isMuted}
            isViewerModerator={isViewerModerator}
            getActions={getActions}
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
