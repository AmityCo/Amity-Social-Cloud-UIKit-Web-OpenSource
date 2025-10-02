import React, { FC, useEffect, useRef, useState } from 'react';
import useMessagesCollection from '~/v4/chat/hooks/collections/useMessagesCollection';
import MessageBubbleIcon from '~/v4/icons/MessageBubble';
import { MessageBubble } from '~/v4/chat/internal-components/MessageBubble/MessageBubble';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageBubbleSkeleton } from '~/v4/chat/internal-components/MessageBubbleSkeleton/MessageBubbleSkeleton';
import { Typography } from '~/v4/core/components';
import styles from './ChatFeed.module.css';
import { ChannelRepository, getChannelTopic, subscribeTopic } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';

interface ChatFeedProps {
  channel: Amity.Channel;
  isJoinedCommunity?: boolean;
}

const isAmityTextMessage = (message: Amity.Message): message is Amity.Message<'text'> => {
  return !!message.data && typeof message.data !== 'string' && 'text' in message.data;
};

const ChatFeed: FC<ChatFeedProps> = ({ channel, isJoinedCommunity }) => {
  const [joined, setJoined] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisitorOrBot } = useSDK();

  const { messages, loading, hasMore, loadMore } = useMessagesCollection(
    {
      subChannelId: channel.channelId,
      includeDeleted: true,
      limit: 15,
    },
    joined && !isVisitorOrBot,
  );

  useEffect(() => {
    const unsubTopic = subscribeTopic(getChannelTopic(channel));
    const joinLiveChannel = async () => {
      try {
        await ChannelRepository.joinChannel(channel.channelId);
      } catch (e) {
        console.error('error: ', e);
      } finally {
        setJoined(true);
      }
    };

    !isVisitorOrBot && joinLiveChannel();

    return () => unsubTopic();
  }, [channel, isVisitorOrBot]);

  const isEmpty = !loading && messages?.length === 0;

  return (
    <div className={styles.chatFeed__container}>
      {isEmpty || isVisitorOrBot ? (
        <div className={styles.chatFeed__empty__container}>
          <MessageBubbleIcon className={styles.chatFeed__empty__icon} />
          <Typography.TitleBold className={styles.chatFeed__emptyText}>
            No messages yet
          </Typography.TitleBold>
          <Typography.Caption className={styles.chatFeed__emptyText}>
            Be the first to start conversation.
          </Typography.Caption>
        </div>
      ) : (
        <div
          className={styles.chatFeed__messageList__container}
          ref={containerRef}
          id="chatFeedScrollableContainer"
        >
          <InfiniteScroll
            scrollableTarget={'chatFeedScrollableContainer'}
            scrollThreshold={0.5}
            hasMore={hasMore || false}
            next={() => loadMore?.()}
            inverse={true}
            loader={
              loading && !messages ? (
                <div className={styles.chatFeed__skeleton__container}>
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <MessageBubbleSkeleton key={index} />
                  ))}
                </div>
              ) : null
            }
            dataLength={messages?.length || 0}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
          >
            <div className={styles.chatFeed__messageList__inner}>
              {messages?.map((message) => {
                if (!isAmityTextMessage(message)) return null;
                return (
                  <MessageBubble
                    key={message.messageId}
                    message={message}
                    isJoinedCommunity={isJoinedCommunity}
                  />
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default ChatFeed;
