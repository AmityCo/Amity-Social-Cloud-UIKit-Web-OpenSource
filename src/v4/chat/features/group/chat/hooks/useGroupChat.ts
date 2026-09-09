import { useMemo } from 'react';
import { useChannelMembersCollection } from '~/v4/chat/hooks/collections/useChannelMembersCollection';
import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { MemberRoles } from '~/v4/chat/constants/memberRoles';
import type { GroupChatPageProps } from '~/v4/chat/pages/GroupChatPage';
import { useChatMessage } from '~/v4/chat/features/shared/hooks/useChatMessage';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';

export function useGroupChat({ channelId, isJustCreated, jumpToMessageId }: GroupChatPageProps) {
  const { push } = useChatNavigation();
  const { channel } = useChannelObject({ channelId });
  const { membership: myMembership } = useChannelMyMembership(channel);
  const isBanned = myMembership?.membership === 'banned';
  const { members: moderators } = useChannelMembersCollection({
    channelId: channelId ?? '',
    roles: [MemberRoles.CHANNEL_MODERATOR],
  });

  const moderatorIds = useMemo(
    () =>
      new Set(
        (moderators ?? [])
          .map((m) => m.userId)
          .filter((id): id is string => typeof id === 'string'),
      ),
    [moderators],
  );

  const isModerator = hasModeratorRole(myMembership?.roles);
  const isUserMuted = !!myMembership?.isMuted;
  const isChannelMuted = !!channel?.isMuted;
  const showMutedBanner = isUserMuted || (isChannelMuted && !isModerator);
  const mutedVariant: 'user' | 'channel' = isUserMuted ? 'user' : 'channel';

  const chatMessage = useChatMessage({
    channelId,
    isJustCreated,
    loadingToastIdPrefix: 'group-chat-loading',
    enableMention: true,
    viewerIsMutedInChannel: isUserMuted,
    jumpToMessageId,
  });

  function handleOpenSettings() {
    if (!channelId) return;
    push({
      type: ChatPageTypes.GroupSettingPage,
      context: { channelId },
    });
  }

  return {
    ...chatMessage,
    channel,
    channelDisplayName: channel?.displayName,
    isUserMuted,
    isChannelMuted,
    isModerator,
    isBanned,
    moderatorIds,
    showMutedBanner,
    mutedVariant,
    handleOpenSettings,
  };
}
