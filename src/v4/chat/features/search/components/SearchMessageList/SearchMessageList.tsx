import { useMemo, useState } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useSDK } from '~/v4/core/hooks/useSDK';
import useMessageSearchCollection from '~/v4/chat/hooks/collections/useMessageSearchCollection';
import useChannelCollection from '~/v4/chat/hooks/collections/useChannelCollection';
import { useArchivedChannelsCollection } from '~/v4/chat/hooks/collections/useArchivedChannelsCollection';
import { useChatNavigation, ChatPageTypes } from '~/v4/chat/providers/ChatNavigationProvider';
import { ChannelItem } from '~/v4/chat/features/home/components/ChannelItem/ChannelItem';
import { EmptyState } from '~/v4/chat/features/shared/components/EmptyState/EmptyState';
import { LIST_SKELETON_ROW_COUNT, SEARCH_MIN_QUERY_LENGTH } from '~/v4/chat/constants';

type SearchMessageListProps = {
  query: string;
};

export function SearchMessageList({ query }: SearchMessageListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { push } = useChatNavigation();
  const { currentUserId } = useSDK();

  const trimmed = query.trim();
  const shouldCall = trimmed.length >= SEARCH_MIN_QUERY_LENGTH;

  const { channels: archivedChannels } = useArchivedChannelsCollection();
  const archivedIds = useMemo(
    () => new Set(archivedChannels.map((c) => c.channelId)),
    [archivedChannels],
  );

  const { messages, hasMore, loadMore, isLoading, isLoadingFirstPage } = useMessageSearchCollection(
    { query: trimmed },
  );

  const channelIds = useMemo(
    () => Array.from(new Set(messages.map((m) => m.channelId))),
    [messages],
  );

  const { channels: matchedChannels } = useChannelCollection(
    { channelIds },
    { shouldCall: channelIds.length > 0 },
  );

  const channelById = useMemo(
    () => new Map(matchedChannels.map((c) => [c.channelId, c])),
    [matchedChannels],
  );

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  function handleNavigate(message: Amity.Message) {
    const channel = channelById.get(message.channelId);
    if (!channel) return;
    if (channel.type === 'conversation') {
      const otherMember = channel.previewMembers?.find((m) => m.userId !== currentUserId);
      push({
        type: ChatPageTypes.ChatPage,
        context: {
          channelId: channel.channelId,
          userId: otherMember?.userId,
          userDisplayName: otherMember?.user?.displayName,
          avatarUrl: otherMember?.user?.avatarFileId,
          jumpToMessageId: message.messageId,
        },
      });
    } else {
      push({
        type: ChatPageTypes.GroupChatPage,
        context: {
          channelId: channel.channelId,
          jumpToMessageId: message.messageId,
        },
      });
    }
  }

  if (!shouldCall) {
    return <EmptyState variant="prompt" />;
  }

  if (messages.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-results" />;
  }

  return (
    <section>
      {messages.map((message) => {
        const channel = channelById.get(message.channelId);
        if (!channel) return null;
        const text = (message.data as { text?: string } | undefined)?.text ?? '';
        return (
          <ChannelItem
            key={message.messageId}
            channel={channel}
            searchQuery={trimmed}
            isArchived={archivedIds.has(channel.channelId)}
            messageBodyOverride={text}
            timestampOverride={message.createdAt}
            hideUnreadIndicators
            highlightStyle="bold"
            onPress={() => handleNavigate(message)}
          />
        );
      })}
      {(isLoadingFirstPage || isLoading) &&
        Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <ChannelItem.Skeleton key={i} />
        ))}
      {hasMore && !isLoadingFirstPage && !isLoading && (
        <div ref={(node) => setSentinelNode(node)} />
      )}
    </section>
  );
}
