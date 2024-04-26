import React, { useRef, useState } from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import ChatItem from '~/chat/components/ChatItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AmityLiveChatPage } from '.';
import styles from '~/v4/chat/pages/AmityLiveChatPage/styles.module.css';
import Sheet from 'react-modal-sheet';

export default {
  title: 'V4/AmityLiveChatPage',
};

const LiveChatList = () => {
  const [selectedChannel, setSelectedChannel] = useState<Amity.Channel['channelId'] | null>(null);
  const [open, setOpen] = useState(false);
  const { channels, hasMore, loadMore, isLoading } = useChannelsCollection({
    membership: 'all',
    sortBy: 'lastActivity',
    types: ['live'],
  });

  const onSelectedChannel = (channelId: string) => {
    setOpen(true);
    setSelectedChannel(channelId);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {containerRef.current ? (
        <InfiniteScroll
          scrollableTarget={containerRef.current}
          scrollThreshold={0.7}
          hasMore={hasMore}
          next={loadMore}
          loader={isLoading ? <span key={0}>Loading...</span> : null}
          inverse={true}
          dataLength={channels.length}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          height={containerRef.current.clientHeight}
        >
          {channels.map((channel) => (
            <ChatItem
              channelId={channel.channelId}
              key={channel.channelId}
              isSelected={selectedChannel === channel.channelId}
              onSelect={(data) => {
                onSelectedChannel(data.channelId);
              }}
            />
          ))}
        </InfiniteScroll>
      ) : null}

      <Sheet isOpen={open} onClose={() => setOpen(false)} className={styles.messageListSheet}>
        <Sheet.Container className={styles.messageListSheetContainer}>
          <Sheet.Header />
          <Sheet.Content>
            <AmityLiveChatPage channelId={selectedChannel || ''} />
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};

export const LiveChatStory = {
  render: () => <LiveChatList />,
  name: 'AmityLiveChatPage',
};
