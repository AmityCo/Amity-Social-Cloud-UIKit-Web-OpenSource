import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { LiveChatLoadingIndicator } from './LiveChatLoadingIndicator';
import useSDK from '~/core/hooks/useSDK';
import { SenderMessageBubble } from '~/v4/chat/elements/SenderMessageBubble';
import { ReceiverMessageBubble } from '~/v4/chat/elements/ReceiverMessageBubble';
import { deleteMessage, flagMessage } from '~/v4/utils';
import useMessagesCollection from '~/chat/hooks/collections/useMessagesCollection';
import { Typography } from '~/v4/core/components';
import Redo from '~/v4/icons/Redo';
import { unFlagMessage } from '~/v4/utils/unFlagMessage';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';
import { useCopyMessage } from '~/v4/core/hooks';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

import styles from './MessageList.module.css';

interface AmityLiveChatMessageListProps {
  pageId?: string;
  channel: Amity.Channel;
  replyMessage: (message: Amity.Message<'text'>) => void;
}

export const MessageList = ({
  pageId = '*',
  channel,
  replyMessage,
}: AmityLiveChatMessageListProps) => {
  const componentId = 'message_list';

  const sdk = useSDK();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const { confirm } = useConfirmContext();
  const notification = useLiveChatNotifications();
  const copyMessage = useCopyMessage();

  const { themeStyles } = useAmityComponent({ pageId, componentId });

  const {
    messages: rawMessages,
    hasMore,
    loadMore,
    isLoading,
    error,
  } = useMessagesCollection({
    subChannelId: channel.channelId,
    sortBy: 'segmentDesc',
    limit: 10,
    includeDeleted: true,
  });

  const messages = rawMessages as Amity.Message<'text'>[];

  const onDeleteMessage = (messageId: string) => {
    confirm({
      title: 'Delete this message?',
      content: 'This message will also be removed from your friend’s devices.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: () =>
        deleteMessage(messageId, {
          onError: () =>
            notification.error({
              content: 'Unable to delete message. Please try again.',
            }),
        }),
    });
  };

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className={styles.customStatusContainer} ref={containerRef} style={themeStyles}>
        <div className={styles.iconContainer}>
          <Redo />
        </div>
        <Typography.Caption>Couldn't load chat</Typography.Caption>
      </div>
    );
  }

  return (
    <div className={styles.infiniteScrollContainer} ref={containerRef} style={themeStyles}>
      {containerRef.current && (
        <InfiniteScroll
          className={styles.infiniteScrollInner}
          scrollableTarget={containerRef.current}
          scrollThreshold={0.7}
          hasMore={hasMore}
          next={loadMore}
          loader={
            isLoading ? (
              <div className={styles.loadingIndicatorWrap}>
                <LiveChatLoadingIndicator className={styles.loadingIndicator} />
              </div>
            ) : null
          }
          inverse={true}
          dataLength={messages.length}
          height={containerRef.current.clientHeight}
        >
          {messages.map((message, i) => {
            if (message.creatorId === sdk.currentUserId)
              return (
                <SenderMessageBubble
                  message={message}
                  action={
                    !channel.isMuted
                      ? {
                          onReply: () => replyMessage(message),
                          onDelete: () => onDeleteMessage(message.messageId),
                          onCopy: () => message.data?.text && copyMessage(message.data?.text),
                        }
                      : undefined
                  }
                  key={message.messageId}
                  containerRef={containerRef}
                  pageId={pageId}
                  componentId={componentId}
                />
              );

            return (
              <ReceiverMessageBubble
                message={message}
                action={{
                  onReply: () => replyMessage(message),
                  onDelete: () => onDeleteMessage(message.messageId),
                  onCopy: () => message.data?.text && copyMessage(message.data?.text),
                  onFlag: () =>
                    flagMessage(
                      message.messageId,
                      () =>
                        notification.success({
                          content: 'Message reported',
                        }),
                      () =>
                        notification.error({
                          content: 'This message failed to be reported. Please try again.',
                        }),
                    ),
                  onUnflag: () =>
                    unFlagMessage(
                      message.messageId,
                      () =>
                        notification.success({
                          content: 'Message unreported',
                        }),
                      () =>
                        notification.error({
                          content: 'This message failed to be unreported. Please try again.',
                        }),
                    ),
                }}
                key={message.messageId}
                containerRef={containerRef}
                pageId={pageId}
                componentId={componentId}
              />
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};
