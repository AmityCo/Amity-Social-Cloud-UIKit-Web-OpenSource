import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import MessageComponent from '~/chat/components/Message';
import DateDivider from './DateDivider';

import styles from './styles.module.css';
import useSDK from '~/core/hooks/useSDK';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';
import useMessagesCollection from '~/chat/hooks/collections/useMessagesCollection';

interface MessageItemProps {
  message: Amity.Message;
  isConsequent: boolean;
  isIncoming: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MessageItem = ({ message, isConsequent, isIncoming, containerRef }: MessageItemProps) => {
  const user = useUser(message.creatorId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <MessageComponent
      key={message.messageId}
      avatar={avatarFileUrl || ''}
      messageId={message.messageId}
      data={(message as Amity.Message<'text'>)?.data || ''}
      type={message.dataType}
      createdAt={new Date(message.createdAt)}
      isDeleted={message.isDeleted}
      userDisplayName={user?.displayName || ''}
      isConsequent={isConsequent}
      isIncoming={isIncoming}
      containerRef={containerRef}
    />
  );
};

interface MessageListProps {
  channelId: string;
}

const MessageList = ({ channelId }: MessageListProps) => {
  const { client } = useSDK();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const { messages, hasMore, loadMore, isLoading } = useMessagesCollection({
    subChannelId: channelId,
    sortBy: 'segmentDesc',
    limit: 20,
  });

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      messages[0].markRead();
    }
  }, [isLoading, messages]);

  // Update container height when channelId changes or when container ref is available
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.clientHeight;
        if (newHeight > 0) {
          setContainerHeight(newHeight);
        }
      }
    };

    const initialTimeout = setTimeout(updateHeight, 50);

    const handleResize = () => {
      updateHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [channelId]);
  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      const newHeight = containerRef.current.clientHeight;
      if (newHeight > 0 && newHeight !== containerHeight) {
        setContainerHeight(newHeight);
      }
    }
  }, [messages, containerHeight]);

  // Force re-render of InfiniteScroll when channelId changes
  const infiniteScrollKey = `infinite-scroll-${channelId}`;

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const renderMessagesWithDateDividers = () => {
    const elements: React.ReactElement[] = [];

    messages.forEach((message, i) => {
      const messageDate = new Date(message.createdAt);
      const nextMessage = messages[i + 1];
      const isConsequent = nextMessage && nextMessage.creatorId === message.creatorId;
      const isIncoming = message.creatorId !== client?.userId;

      if (!message?.data || !message.createdAt) return;

      elements.push(
        <MessageItem
          key={message.messageId}
          message={message}
          isConsequent={isConsequent}
          isIncoming={isIncoming}
          containerRef={containerRef}
        />,
      );

      const nextMessageDate = nextMessage ? new Date(nextMessage.createdAt) : null;
      if (!nextMessageDate || !isSameDay(messageDate, nextMessageDate)) {
        elements.push(
          <DateDivider key={`date-${messageDate.toDateString()}`} date={messageDate} />,
        );
      }
    });

    return elements;
  };

  return (
    <div className={styles.infiniteScrollContainer} ref={containerRef}>
      {containerRef.current && containerHeight > 0 ? (
        <InfiniteScroll
          key={infiniteScrollKey}
          scrollableTarget={containerRef.current}
          scrollThreshold={0.7}
          hasMore={hasMore}
          next={loadMore}
          loader={isLoading ? <span key={0}>Loading...</span> : null}
          inverse={true}
          dataLength={messages?.length || 0}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          height={containerHeight}
        >
          <div className={styles.messageListContainer} data-testid="message-list">
            {renderMessagesWithDateDividers()}
          </div>
        </InfiniteScroll>
      ) : null}
    </div>
  );
};

export default (props: MessageListProps) => {
  const CustomComponentFn = useCustomComponent<MessageListProps>('MessageList');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <MessageList {...props} />;
};
