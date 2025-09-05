import React, { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import MessageComponent from '~/chat/components/Message';

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

  return (
    <div className={styles.infiniteScrollContainer} ref={containerRef}>
      {containerRef.current ? (
        <InfiniteScroll
          scrollableTarget={containerRef.current}
          scrollThreshold={0.7}
          hasMore={hasMore}
          next={loadMore}
          loader={isLoading ? <span key={0}>Loading...</span> : null}
          inverse={true}
          dataLength={messages?.length || 0}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          height={containerRef.current.clientHeight}
        >
          <div
            className={styles.messageListContainer}
            ref={containerRef}
            data-testid="message-list"
          >
            {messages.map((message, i) => {
              const nextMessage = messages[i + 1];
              const isConsequent = nextMessage && nextMessage.creatorId === message.creatorId;
              const isIncoming = message.creatorId !== client?.userId;

              if (!message?.data || !message.createdAt) return <></>;

              return (
                <MessageItem
                  key={message.messageId}
                  message={message}
                  isConsequent={isConsequent}
                  isIncoming={isIncoming}
                  containerRef={containerRef}
                />
              );
            })}
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
