import { useState } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useString } from '~/v4/core/localization';
import { useArchivedChannelsCollection } from '~/v4/chat/hooks/collections/useArchivedChannelsCollection';
import { useChannelArchiveQuery } from '~/v4/chat/hooks/queries';
import { ChannelItem } from '~/v4/chat/features/home/components/ChannelItem/ChannelItem';
import { EmptyState } from '~/v4/chat/features/shared/components/EmptyState/EmptyState';
import { SwipeToLeft } from '~/v4/chat/components/SwipeToLeft';
import { Unarchive } from '~/v4/core/design/icons/Unarchive';
import { LIST_PAGE_LIMIT, LIST_SKELETON_ROW_COUNT } from '~/v4/chat/constants';
import styles from './ArchivedChannelList.module.css';

export function ArchivedChannelList() {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { unarchiveChannel } = useChannelArchiveQuery();
  const unarchiveLabel = useString('amity_chat_unarchive');

  const { channels, isLoadingFirstPage, hasMore, loadMore, isLoading } =
    useArchivedChannelsCollection({ limit: LIST_PAGE_LIMIT });

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  async function handleUnarchive(channelId: string) {
    await unarchiveChannel({ channelId });
  }

  if (channels.length === 0 && !isLoadingFirstPage && !isLoading) {
    return (
      <div className={styles.archivedChannelList}>
        <EmptyState variant="no-archived-chats" />
      </div>
    );
  }

  return (
    <div className={styles.archivedChannelList}>
      {channels.map((channel) => (
        <SwipeToLeft
          key={channel.channelId}
          actionLabel={unarchiveLabel}
          actionIcon={Unarchive}
          onAction={() => handleUnarchive(channel.channelId)}
        >
          <ChannelItem channel={channel} />
        </SwipeToLeft>
      ))}
      {(isLoadingFirstPage || isLoading) &&
        Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <ChannelItem.Skeleton key={i} />
        ))}
      {hasMore && !isLoadingFirstPage && !isLoading && (
        <div ref={(node) => setSentinelNode(node)} />
      )}
    </div>
  );
}
