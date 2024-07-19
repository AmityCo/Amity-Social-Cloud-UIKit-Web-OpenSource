import React, { useRef, useState } from 'react';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import ChatItem from '~/chat/components/ChatItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import Sheet from 'react-modal-sheet';
import { LiveChat } from './';
import styles from './LiveChat.module.css';

export default {
  title: 'V4/LiveChat',
};

const LiveChatList = () => {
  const [selectedChannel, setSelectedChannel] = useState<Amity.Channel['channelId'] | null>(null);
  const { channels, hasMore, loadMore, isLoading } = useChannelsCollection({
    membership: 'all',
    sortBy: 'lastActivity',
    types: ['live'],
  });

  const onSelectedChannel = (channelId: string) => {
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
      {selectedChannel && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100dvw', height: '100dvh' }}>
          <LiveChat channelId={selectedChannel} />
        </div>
      )}
    </div>
  );
};

export const LiveChatStory = {
  render: () => <LiveChatList />,
  name: 'LiveChat',
};
