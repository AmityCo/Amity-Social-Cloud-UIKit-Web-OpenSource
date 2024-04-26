import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.css';
import LivechatLoadingIndicator from '~/v4/chat/components/LivechatLoadingIndicator';
import useSDK from '~/core/hooks/useSDK';
import AmityLiveChatMessageSenderView from '../AmityLiveChatMessageSenderView';
import AmityLiveChatMessageReceiverView from '../AmityLiveChatMessageReceiverView';
import { deleteMessage, flagMessage } from '~/v4/utils';
import useMessagesCollection from '~/chat/hooks/collections/useMessagesCollection';
import { FormattedMessage, useIntl } from 'react-intl';
import { Typography } from '~/v4/core/components';
import Redo from '~/v4/icons/Redo';
import { unFlagMessage } from '~/v4/utils/unFlagMessage';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';
import { useCopyMessage } from '~/v4/core/hooks';

interface AmityLiveChatMessageListProps {
  channel: Amity.Channel;
  replyMessage: (message: Amity.Message<'text'>) => void;
}

export const AmityLiveChatMessageList = ({
  channel,
  replyMessage,
}: AmityLiveChatMessageListProps) => {
  const sdk = useSDK();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { formatMessage } = useIntl();
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const { confirm } = useConfirmContext();
  const notification = useLiveChatNotifications();
  const copyMessage = useCopyMessage();

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
      title: formatMessage({ id: 'livechat.modal.delete.message.title' }),
      content: formatMessage({ id: 'livechat.modal.delete.message.content' }),
      cancelText: formatMessage({ id: 'cancel' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: () =>
        deleteMessage(messageId, {
          onError: () =>
            notification.error({
              content: formatMessage({ id: 'livechat.delete.message.error' }),
            }),
        }),
      theme: 'dark',
    });
  };

  React.useEffect(() => {
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
      <div className={styles.customStatusContainer} ref={containerRef}>
        <div className={styles.iconContainer}>
          <Redo />
        </div>
        <Typography.Caption>
          <FormattedMessage id="chat.loading.error" />
        </Typography.Caption>
      </div>
    );
  }

  return (
    <div className={styles.infiniteScrollContainer} ref={containerRef}>
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
                <LivechatLoadingIndicator className={styles.loadingIndicator} />
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
                <AmityLiveChatMessageSenderView
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
                />
              );

            return (
              <AmityLiveChatMessageReceiverView
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
                          content: formatMessage({ id: 'livechat.report.message.success' }),
                        }),
                      () =>
                        notification.error({
                          content: formatMessage({ id: 'livechat.report.message.error' }),
                        }),
                    ),
                  onUnflag: () =>
                    unFlagMessage(
                      message.messageId,
                      () =>
                        notification.success({
                          content: formatMessage({ id: 'livechat.unReport.message.success' }),
                        }),
                      () =>
                        notification.error({
                          content: formatMessage({ id: 'livechat.unReport.message.error' }),
                        }),
                    ),
                }}
                key={message.messageId}
                containerRef={containerRef}
              />
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default AmityLiveChatMessageList;
