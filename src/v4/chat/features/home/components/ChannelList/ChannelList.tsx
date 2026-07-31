import { useState } from 'react';
import { Button } from '~/v4/core/design/atoms/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useChannelCollection from '~/v4/chat/hooks/collections/useChannelCollection';
import { useChannelArchiveQuery } from '~/v4/chat/hooks/queries';
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
};

export function ChannelList({ types }: ChannelListProps) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const { archiveChannel } = useChannelArchiveQuery();
  const archiveLabel = useString('amity_chat_archive');

  const { channels, isLoadingFirstPage, hasMore, loadMore, isLoading } = useChannelCollection({
    types,
    isDeleted: false,
    membership: 'member',
    excludeArchives: true,
    limit: LIST_PAGE_LIMIT,
  });

  useIntersectionObserver({
    node: sentinelNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoadingFirstPage && !isLoading && loadMore(),
  });

  async function handleArchive(channelId: string) {
    await archiveChannel({ channelId });
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

function EmptyChannelList() {
  const { push } = useChatNavigation();
  const emptyTitle = useString('amity_chat_home_empty_title');
  const emptyDescription = useString('amity_chat_home_empty_description');
  const createNewChatLabel = useString('amity_chat_create_new_chat');

  return (
    <div className={styles.channelList__empty}>
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
