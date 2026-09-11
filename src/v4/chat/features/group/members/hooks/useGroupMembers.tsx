import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { GroupMemberListPageProps } from '~/v4/chat/pages/GroupMemberListPage';

export function useGroupMembers({ channelId }: GroupMemberListPageProps) {
  const { pop, push } = useChatNavigation();
  const { canAddMember } = useChannelPermission(channelId);

  const isViewerModerator = canAddMember;

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
