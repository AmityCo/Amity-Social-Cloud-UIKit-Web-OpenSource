import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import useMessagesCollection from '~/v4/chat/hooks/collections/useMessagesCollection';
import MessageBubbleIcon from '~/v4/icons/MessageBubble';
import { MessageBubble } from '~/v4/chat/internal-components/MessageBubble/MessageBubble';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageBubbleSkeleton } from '~/v4/chat/internal-components/MessageBubbleSkeleton/MessageBubbleSkeleton';
import { Typography } from '~/v4/core/components';
import styles from './ChatFeed.module.css';
import {
  ChannelRepository,
  getChannelTopic,
  subscribeTopic,
  RoomRepository,
} from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { LivestreamPinnedProduct } from '~/v4/social/features/product-tagged/elements/LivestreamPinnedProduct';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { useTaggingProduct } from '~/v4/social/hooks/useTaggingProduct';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamModeration } from '~/v4/social/features/livestream/hooks/useLivestreamModeration';
import { usePostSubscription } from '~/v4/social/features/livestream/hooks';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';

interface ChatFeedProps {
  channel: Amity.Channel;
  isJoinedCommunity?: boolean;
  isLoading?: boolean;
  pageId?: string;
  componentId?: string;
}

const isAmityTextMessage = (message: Amity.Message): message is Amity.Message<'text'> => {
  return !!message.data && typeof message.data !== 'string' && 'text' in message.data;
};

const ChatFeed: FC<ChatFeedProps> = ({
  channel,
  isJoinedCommunity,
  isLoading,
  pageId,
  componentId,
}) => {
  const [joined, setJoined] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [currentMessages, setCurrentMessages] = useState<Amity.Message<any>[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isVisitorOrBot } = useSDK();
  const { channel: liveChannel, loading: liveChannelLoading } = useChannel({
    channelId: channel.channelId,
  });

  const { success, info } = useNotifications();

  const { messages, loading, hasMore, loadMore } = useMessagesCollection(
    {
      subChannelId: channel.channelId,
      includeDeleted: true,
      limit: 15,
    },
    joined && !isVisitorOrBot && !!liveChannel,
  );

  const { unpinProduct, updateProductTags } = useTaggingProduct();

  // Livestream pinned product logic
  const {
    room,
    hostId,
    coHostId,
    subscribedChildPost: subscribedPost,
    livestreamPost,
  } = useLivestreamData();

  const { post: subscribedParentPost } = usePostSubscription(livestreamPost?.postId);
  const pinnedProductId = subscribedPost?.pinnedProductId;
  const lastKnownPinnedTagRef = useRef<Amity.MediaProductTag | undefined>(undefined);
  const [dismissedPinnedProductId, setDismissedPinnedProductId] = useState<string | undefined>(
    undefined,
  );

  const isShowPinnedProduct = !!pinnedProductId && pinnedProductId !== dismissedPinnedProductId;

  useEffect(() => {
    // When a new pinned product arrives, clear the dismissed state so it shows again
    if (pinnedProductId && pinnedProductId !== dismissedPinnedProductId) {
      setDismissedPinnedProductId(undefined);
    }
  }, [pinnedProductId]);

  const { canCoHostManageProductTags } = useLivestreamModeration({
    room,
  });

  const { productCatalogueSettings } = useProductCatalogueSettings();

  const isHost = hostId === useSDK().currentUserId;
  const isCoHost = coHostId === useSDK().currentUserId;

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

  const onUnpin = async () => {
    await unpinProduct(subscribedPost?.postId || '');
  };

  const onRemove = async () => {
    const updateProduct = subscribedPost?.productTags?.filter(
      (tag) => tag.productId !== pinnedProductId,
    );
    try {
      await updateProductTags({
        postId: subscribedPost?.postId || '',
        productTags: updateProduct || [],
      });
      success({ content: 'Product tag removed.' });
    } catch (error) {
      info({
        content: 'Failed to remove product tag. Please try again.',
      });
    }
  };

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

  const renderPinnedProductOverlay = () => {
    if (
      subscribedParentPost?.feedType === 'reviewing' ||
      !productCatalogueSettings?.product.enabled
    )
      return null;
    if (subscribedPost?.productTags && pinnedProductId && isShowPinnedProduct) {
      const pinnedTag = subscribedPost.productTags?.find(
        (tag) => tag.productId === pinnedProductId,
      );
      const updateProduct = subscribedPost?.productTags?.filter(
        (tag) => tag.productId !== pinnedProductId,
      );

      // Keep last known tag so the component stays mounted during brief sync gaps
      if (pinnedTag) {
        lastKnownPinnedTagRef.current = pinnedTag;
      }

      const tagToRender = pinnedTag ?? lastKnownPinnedTagRef.current;
      if (!tagToRender) return null;

      // User can manage if they're the host OR if they're the co-host with permission
      const canManage = isHost || (isCoHost && canCoHostManageProductTags);

      return (
        <LivestreamPinnedProduct
          key={pinnedProductId}
          pageId={pageId}
          componentId={componentId}
          productTag={tagToRender}
          isViewer={!canManage}
          sourceId={room?.roomId}
          onClosePinnedProduct={() => setDismissedPinnedProductId(pinnedProductId)}
          onUnpin={onUnpin}
          onRemove={onRemove}
        />
      );
    }
    return null;
  };
  return (
    <div className={styles.chatFeed__container}>
      {liveChannelLoading || isEmpty || isVisitorOrBot ? (
        <>
          <div
            data-pinned-product={isShowPinnedProduct}
            className={styles.chatFeed__empty__container}
          >
            <MessageBubbleIcon className={styles.chatFeed__empty__icon} />
            <Typography.TitleBold className={styles.chatFeed__emptyText}>
              No messages yet
            </Typography.TitleBold>
            <Typography.Caption className={styles.chatFeed__emptyText}>
              Be the first to start conversation.
            </Typography.Caption>
            <div className={styles.chatFeed__empty__container__pinned_overlay}>
              {renderPinnedProductOverlay()}
            </div>
          </div>
        </>
      ) : (
        <div
          ref={containerRef}
          id="chatFeedScrollableContainer"
          data-disable-scroll={`${isPopoverOpen}`}
          className={styles.chatFeed__messageList__container}
        >
          {loading || isLoading ? (
            renderLoadingSkeleton()
          ) : (
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
              {renderPinnedProductOverlay()}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ChatFeed;
