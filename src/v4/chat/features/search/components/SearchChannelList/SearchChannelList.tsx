import { useMemo, useState } from 'react';
import { useString } from '~/v4/core/localization';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useSearchChannelsCollection from '~/v4/chat/hooks/collections/useSearchChannelsCollection';
import { useArchivedChannelsCollection } from '~/v4/chat/hooks/collections/useArchivedChannelsCollection';
import { useChannelArchiveQuery } from '~/v4/chat/hooks/queries';
import { ChannelItem } from '~/v4/chat/features/home/components/ChannelItem/ChannelItem';
import { EmptyState } from '~/v4/chat/features/shared/components/EmptyState/EmptyState';
import { SwipeToLeft } from '~/v4/chat/components/SwipeToLeft';
import {
  LIST_PAGE_LIMIT,
  LIST_SKELETON_ROW_COUNT,
  SEARCH_MIN_QUERY_LENGTH,
} from '~/v4/chat/constants';
import { Archive } from '~/v4/icons/Archive';
import { Unarchive } from '~/v4/icons/Unarchive';

type SearchChannelListProps = {
  query: string;
};

export function SearchChannelList({ query }: SearchChannelListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { archiveChannel, unarchiveChannel } = useChannelArchiveQuery();
  const archiveLabel = useString('amity_chat_archive');
  const unarchiveLabel = useString('amity_chat_unarchive');

  const trimmed = query.trim();
  const shouldCall = trimmed.length >= SEARCH_MIN_QUERY_LENGTH;

  const { channels: archivedChannels } = useArchivedChannelsCollection({ limit: 100 });

  const archivedIds = useMemo(
    () => new Set(archivedChannels.map((c) => c.channelId)),
    [archivedChannels],
  );

  const { channels, hasMore, loadMore, isLoading, isLoadingFirstPage } =
    useSearchChannelsCollection(
      {
        query: trimmed,
        limit: LIST_PAGE_LIMIT,
        isMemberOnly: true,
        types: ['conversation', 'community'],
        sortBy: 'lastActivity',
        orderBy: 'desc',
      },
      { shouldCall },
    );

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  if (!shouldCall) {
    return <EmptyState variant="prompt" />;
  }

  if (channels.length === 0 && !isLoading && !isLoadingFirstPage) {
    return <EmptyState variant="no-results" />;
  }

  return (
    <section>
      {channels.map((channel) => {
        const isArchived = archivedIds.has(channel.channelId);
        return (
          <SwipeToLeft
            key={channel.channelId}
            actionLabel={isArchived ? unarchiveLabel : archiveLabel}
            actionIcon={isArchived ? Unarchive : Archive}
            onAction={() =>
              isArchived
                ? unarchiveChannel({ channelId: channel.channelId })
                : archiveChannel({ channelId: channel.channelId })
            }
          >
            <ChannelItem channel={channel} searchQuery={trimmed} isArchived={isArchived} />
          </SwipeToLeft>
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
