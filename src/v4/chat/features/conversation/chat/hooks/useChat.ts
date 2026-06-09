import { useChatMessage } from '~/v4/chat/features/shared/hooks/useChatMessage';
import { useChannelObject, useFollowInfo } from '~/v4/chat/hooks/objects';
import { useConversationActions } from '~/v4/chat/features/conversation/chat/hooks/useConversationActions';
import type { ChatPageProps } from '~/v4/chat/pages/ChatPage';

export function useChat({
  channelId,
  userId,
  userDisplayName,
  avatarUrl,
  isJustCreated,
  jumpToMessageId,
}: ChatPageProps) {
  const { isBlockedByMe: isUserBlocked } = useFollowInfo({ userId });

  const { channel } = useChannelObject({ channelId });

  const { openConversationActions } = useConversationActions({
    channelId: channelId ?? '',
    otherUserId: userId,
  });

  const chatMessage = useChatMessage({
    channelId,
    isJustCreated,
    loadingToastIdPrefix: 'chat-loading',
    enableMention: false,
    jumpToMessageId,
  });

  const showMutedBanner = isUserBlocked;
  const mutedVariant: 'user' | 'channel' | 'blocked' = 'blocked';

  return {
    ...chatMessage,
    channel,
    otherUser: { userId, userDisplayName, avatarUrl },
    isUserMuted: false,
    isChannelMuted: false,
    isModerator: false,
    isUserBlocked,
    showMutedBanner,
    mutedVariant,
    openConversationActions,
  };
}
