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
import { useChannel } from '~/v4/chat/hooks/useChannel';
import useCurrentUserChannelMembership from '~/v4/chat/hooks/useCurrentUserChannelMembership';
import { MemberRoles } from '~/v4/chat/constants/memberRoles';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { useString } from '~/v4/core/localization';

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

  const { isVisitorOrBot, currentUserId } = useSDK();
  const { channel: liveChannel, loading: liveChannelLoading } = useChannel({
    channelId: channel.channelId,
  });

  // Channel role changes have no reliable MQTT event, but promotions/demotions
  // also rewrite channel.metadata.moderators, which *is* delivered in realtime
  // via the documented channel.updated event. Use it as the refresh trigger so
  // the current user's roles (and their own moderator badge) update live.
  const moderatorsRefreshKey = liveChannel
    ? JSON.stringify(liveChannel.metadata?.moderators ?? [])
    : undefined;

  const { membership: currentUserMembership, refresh: refreshMembership } =
    useCurrentUserChannelMembership(channel.channelId, {
      enabled: joined && !isVisitorOrBot,
      refreshKey: moderatorsRefreshKey,
    });

  // The promoter assigns the channel-moderator role right after updating
  // metadata.moderators, so our refetch can land before the role write does.
  // If metadata says the current user is a moderator but the role hasn't
  // appeared yet, re-query once more shortly after.
  const isSelfInMetadataModerators = !!(
    currentUserId && liveChannel?.metadata?.moderators?.includes(currentUserId)
  );
  const hasChannelModeratorRole = !!currentUserMembership?.roles?.includes(
    MemberRoles.CHANNEL_MODERATOR,
  );

  useEffect(() => {
    if (!joined || isVisitorOrBot) return;
    if (!isSelfInMetadataModerators || hasChannelModeratorRole) return;
    const timer = setTimeout(() => refreshMembership(), 3000);
    return () => clearTimeout(timer);
  }, [joined, isVisitorOrBot, isSelfInMetadataModerators, hasChannelModeratorRole]);

  const { messages, loading, hasMore, loadMore } = useMessagesCollection(
    {
      subChannelId: channel.channelId,
      includeDeleted: true,
      limit: 15,
    },
    joined && !isVisitorOrBot && !!liveChannel,
  );

  const { parentPost } = useLivestreamData();

  const noMessagesTitle = useString('amity_chat_empty_state_no_messages_title');
  const pendingPostDescription = useString('amity_chat_empty_state_pending_post_description');
  const startConversationDescription = useString(
    'amity_chat_empty_state_start_conversation_description',
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

  const isPendingPost = parentPost?.feedType === 'reviewing';

  return (
    <div className={styles.chatFeed__container}>
      {liveChannelLoading || isEmpty || isVisitorOrBot ? (
        <>
          <div className={styles.chatFeed__empty__container}>
            <MessageBubbleIcon className={styles.chatFeed__empty__icon} />
            <Typography.TitleBold className={styles.chatFeed__emptyText}>
              {noMessagesTitle}
            </Typography.TitleBold>
            <Typography.Caption className={styles.chatFeed__emptyText}>
              {isPendingPost ? pendingPostDescription : startConversationDescription}
            </Typography.Caption>
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
              <div className={styles.chatFeed__messageList__inner}>
                {(isPopoverOpen ? currentMessages : messages)?.map((message) => {
                  if (!isAmityTextMessage(message)) return null;
                  return (
                    <MessageBubble
                      key={message.messageId}
                      message={message}
                      channel={liveChannel}
                      currentUserMembership={currentUserMembership}
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
