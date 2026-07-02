import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { GroupMemberListPageProps } from '~/v4/chat/pages/GroupMemberListPage';

export function useGroupMembers({ channelId }: GroupMemberListPageProps) {
  const { pop, push } = useChatNavigation();
  const { channel } = useChannelObject({ channelId });
  const { membership } = useChannelMyMembership(channel);

  const isViewerModerator = hasModeratorRole(membership?.roles);

  const handleBack = () => pop();

  const handleOpenAddMember = () =>
    push({
      type: ChatPageTypes.AddGroupMemberPage,
      context: { channelId },
    });

  return {
    channelId,
    isViewerModerator,
    handleBack,
    handleOpenAddMember,
  };
}
