import { useEffect, useRef, useState } from 'react';
import { Button } from '~/v4/core/design/atoms/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useChannelCollection from '~/v4/chat/hooks/collections/useChannelCollection';
import { useChannelArchiveQuery } from '~/v4/chat/hooks/queries';
import { useChatFeatureFlags } from '~/v4/chat/hooks/useChatFeatureFlags';
import { ERROR_CODE } from '~/v4/chat/constants';
import { useChatNavigation, ChatPageTypes } from '~/v4/chat/providers/ChatNavigationProvider';
import { ChannelItem } from '~/v4/chat/features/home/components/ChannelItem/ChannelItem';
import { SwipeToLeft } from '~/v4/chat/components/SwipeToLeft';
import { LIST_PAGE_LIMIT, LIST_SKELETON_ROW_COUNT } from '~/v4/chat/constants';
import { EmptyCommunity2 } from '~/v4/core/design/illustrations/EmptyCommunity2';
import { Plus } from '~/v4/core/design/icons/Plus';
import { Archive } from '~/v4/core/design/icons/Archive';
import styles from './ChannelList.module.css';

type ChannelListProps = {
  types?: Amity.ChannelType[];
  /** The chat home is mounted but not shown; see `ChatHomePage`. */
  hidden?: boolean;
};

export function ChannelList({ types, hidden = false }: ChannelListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { archiveChannel } = useChannelArchiveQuery();
  const archiveLabel = useString('amity_chat_archive');
  const { channelListSortBy } = useChatFeatureFlags();

  const { channels, isLoadingFirstPage, hasMore, loadMore, isLoading, error, refresh } =
    useChannelCollection({
      types,
      isDeleted: false,
      membership: 'member',
      sortBy: channelListSortBy,
      excludeArchives: true,
      limit: LIST_PAGE_LIMIT,
    });

  // The chat home stays mounted, hidden, while another chat page is on top
  // (Application.tsx), so a first page that failed on a transient error would
  // otherwise stay failed until the app reloads. Retry when the page comes
  // back into view and the list is still empty and in error. The
  // sort-not-available error is a configuration problem, not a transient one,
  // and is not retried (AmityChatHomePage v3 REQ-022).
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const wasHiddenRef = useRef(hidden);
  useEffect(() => {
    const becameVisible = wasHiddenRef.current && !hidden;
    wasHiddenRef.current = hidden;
    if (!becameVisible || !error || channels.length > 0) return;
    if (isSortNotAvailableError(error)) return;
    refreshRef.current();
  }, [hidden, error, channels.length]);

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  async function handleArchive(channelId: string) {
    await archiveChannel({ channelId });
  }

  // The row timestamp follows the sort (AmityChatHomePage v3 REQ-023): with
  // "lastMessage" a member change neither moves a row nor changes its time.
  function rowTimestamp(channel: Amity.Channel): Amity.timestamp | undefined {
    if (channelListSortBy !== 'lastMessage') return undefined;
    return channel.lastMessageAt ?? channel.createdAt;
  }

  if (error && channels.length === 0) {
    return <ChannelListError />;
  }

  if (channels.length === 0 && !isLoadingFirstPage && !isLoading) {
    return <EmptyChannelList />;
  }

  return (
    <div>
      {channels.map((channel) => (
        <SwipeToLeft
          key={channel.channelId}
          actionLabel={archiveLabel}
          actionIcon={Archive}
          onAction={() => handleArchive(channel.channelId)}
        >
          <ChannelItem channel={channel} timestampOverride={rowTimestamp(channel)} />
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

function isSortNotAvailableError(error: Error): boolean {
  return error.message.includes(ERROR_CODE.BUSINESS_ERROR);
}

function ChannelListError() {
  const errorTitle = useString('amity_chat_home_error_title');
  const errorDescription = useString('amity_chat_home_error_description');

  return (
    <div className={styles.channelList__empty} data-testid="chat-error-state">
      <EmptyCommunity2 />
      <div className={styles.channelList__emptyContent}>
        <div className={styles.channelList__emptyText}>
          <Typography.TitleBold className={styles.channelList__emptyTitle}>
            {errorTitle}
          </Typography.TitleBold>
          <Typography.Caption className={styles.channelList__emptySubtitle}>
            {errorDescription}
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
}

function EmptyChannelList() {
  const { push } = useChatNavigation();
  const emptyTitle = useString('amity_chat_home_empty_title');
  const emptyDescription = useString('amity_chat_home_empty_description');
  const createNewChatLabel = useString('amity_chat_create_new_chat');

  return (
    <div className={styles.channelList__empty} data-testid="chat-empty-state">
      <EmptyCommunity2 />
      <div className={styles.channelList__emptyContent}>
        <div className={styles.channelList__emptyText}>
          <Typography.TitleBold className={styles.channelList__emptyTitle}>
            {emptyTitle}
          </Typography.TitleBold>
          <Typography.Caption className={styles.channelList__emptySubtitle}>
            {emptyDescription}
          </Typography.Caption>
        </div>
        <Button.Main
          label={createNewChatLabel}
          icon={<Plus />}
          onPress={() =>
            push({
              type: ChatPageTypes.CreateConversationPage,
            })
          }
        />
      </div>
    </div>
  );
}
