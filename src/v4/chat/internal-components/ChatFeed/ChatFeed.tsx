import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import useMessagesCollection from '~/v4/chat/hooks/collections/useMessagesCollection';
import MessageBubbleIcon from '~/v4/icons/MessageBubble';
import { MessageBubble } from '~/v4/chat/internal-components/MessageBubble/MessageBubble';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageBubbleSkeleton } from '~/v4/chat/internal-components/MessageBubbleSkeleton/MessageBubbleSkeleton';
import { Typography } from '~/v4/core/components';
import styles from './ChatFeed.module.css';
import { ChannelRepository, getChannelTopic, subscribeTopic } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { useChannel } from '~/v4/chat/hooks/useChannel';

interface ChatFeedProps {
  channel: Amity.Channel;
  isJoinedCommunity?: boolean;
  isLoading?: boolean;
}

const isAmityTextMessage = (message: Amity.Message): message is Amity.Message<'text'> => {
  return !!message.data && typeof message.data !== 'string' && 'text' in message.data;
};

const ChatFeed: FC<ChatFeedProps> = ({ channel, isJoinedCommunity, isLoading }) => {
  const [joined, setJoined] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [currentMessages, setCurrentMessages] = useState<Amity.Message<any>[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisitorOrBot } = useSDK();

  const { channel: liveChannel, loading: liveChannelLoading } = useChannel({
    channelId: channel.channelId,
  });

  const { messages, loading, hasMore, loadMore } = useMessagesCollection(
    {
      subChannelId: channel.channelId,
      includeDeleted: true,
      limit: 15,
    },
    joined && !isVisitorOrBot && !!liveChannel,
  );

  const handlePopoverStateChange = (isOpen: boolean) => {
    setCurrentMessages(isOpen ? messages ?? [] : []);
    setIsPopoverOpen(isOpen);
  };

  useEffect(() => {
    let unsubTopic: Amity.Unsubscriber;
    let retryCount = 0;
    const maxRetries = 5;

    const subscribeWithRetry = () => {
      setTimeout(() => {
        unsubTopic = subscribeTopic(getChannelTopic(channel), (error) => {
          if (error) {
            if (retryCount < maxRetries) {
              retryCount++;
              subscribeWithRetry();
            }
          }
        });
      }, 3000);
    };

    subscribeWithRetry();

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

    return () => unsubTopic?.();
  }, [channel, isVisitorOrBot]);

  const renderLoadingSkeleton = useCallback(() => {
    return (
      <div className={styles.chatFeed__skeleton__container}>
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <MessageBubbleSkeleton key={index} />
        ))}
      </div>
    );
  }, []);

  const isEmpty = !loading && messages?.length === 0;

  return (
    <div className={styles.chatFeed__container}>
      {liveChannelLoading || isEmpty || isVisitorOrBot ? (
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
          ref={containerRef}
          id="chatFeedScrollableContainer"
          data-disable-scroll={`${isPopoverOpen}`}
          className={styles.chatFeed__messageList__container}
        >
          {(loading || isLoading) && renderLoadingSkeleton()}
          <InfiniteScroll
            inverse={true}
            scrollThreshold={0.5}
            hasMore={hasMore || false}
            dataLength={messages?.length || 0}
            next={() => !isPopoverOpen && loadMore?.()}
            scrollableTarget={'chatFeedScrollableContainer'}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            loader={loading && !messages ? renderLoadingSkeleton() : null}
          >
            <div className={styles.chatFeed__messageList__inner}>
              {(isPopoverOpen ? currentMessages : messages)?.map((message) => {
                if (!isAmityTextMessage(message)) return null;
                return (
                  <MessageBubble
                    key={message.messageId}
                    message={message}
                    channel={liveChannel}
                    handlePopoverStateChange={handlePopoverStateChange}
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
