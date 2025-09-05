import React, { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage } from 'react-intl';
import { CreateChat } from '~/icons';

import ChatItem from '~/chat/components/ChatItem';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { ChannelRepository, SubChannelRepository } from '@amityco/ts-sdk';

interface RecentChatProps {
  onChannelSelect?: (data: { channelId: string; type: string }) => void;
  onAddNewChannelClick: () => void;
  selectedChannelId?: string;
  membershipFilter?: 'all' | 'member' | 'notMember';
}

const RecentChat = ({
  onChannelSelect,
  onAddNewChannelClick,
  selectedChannelId,
  membershipFilter,
}: RecentChatProps) => {
  const { channels, hasMore, loadMore } = useChannelsCollection({
    membership: membershipFilter,
    sortBy: 'lastActivity',
    limit: 20,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onClickChannel = async ({
    channelId,
    type,
  }: {
    channelId: string;
    type: Amity.ChannelType;
  }) => {
    if (!['community', 'conversation'].includes(type)) {
      await ChannelRepository.joinChannel(channelId);
    }
    await SubChannelRepository.startMessageReceiptSync(channelId);
  };

  return (
    <div className={styles.recentContainer}>
      <div className={styles.infiniteScrollContainer} ref={containerRef} data-testid="chat-list">
        {containerRef.current ? (
          <InfiniteScroll
            scrollableTarget={containerRef.current}
            scrollThreshold={0.7}
            hasMore={hasMore}
            next={loadMore}
            loader={hasMore && <span key={0}>Loading...</span>}
            dataLength={channels?.length || 0}
          >
            {Array.isArray(channels) &&
              channels.map((channel) => (
                <ChatItem
                  key={channel.channelId}
                  channel={channel}
                  isSelected={selectedChannelId === channel.channelId}
                  onSelect={(data) => {
                    onClickChannel(data);
                    onChannelSelect?.(data);
                  }}
                />
              ))}
          </InfiniteScroll>
        ) : null}
      </div>
    </div>
  );
};

export default (props: RecentChatProps) => {
  const CustomComponentFn = useCustomComponent('RecentChat');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <RecentChat {...props} />;
};
