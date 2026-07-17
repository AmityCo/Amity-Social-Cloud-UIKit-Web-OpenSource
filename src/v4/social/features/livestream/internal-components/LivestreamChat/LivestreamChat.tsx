import React from 'react';
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { LivestreamChatMessageComposer } from '~/v4/social/features/livestream/components/LivestreamChatMessageComposer';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import styles from './LivestreamChat.module.css';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { usePostSubscription } from '~/v4/social/features/livestream/hooks';
import { PinnedProductOverlay } from '~/v4/social/features/product-tagged/internal-components';
import { MessageBubbleSkeleton } from '~/v4/chat/internal-components/MessageBubbleSkeleton/MessageBubbleSkeleton';

export interface LivestreamChatProps {
  pageId: string;
  community?: Amity.Community | null;
  isPoorConnection?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isPlayer?: boolean;
  isPendingPost?: boolean;
}

export const LivestreamChat: React.FC<LivestreamChatProps> = ({
  pageId,
  community,
  isPoorConnection = false,
  isLoading = false,
  disabled = false,
  isPlayer = false,
  isPendingPost = false,
}) => {
  // Get values from context
  const { channel, room, parentPost: post } = useLivestreamData();
  const componentId = COMPONENT_ID.LIVESTREAM_CHAT;

  if (!channel || !post) {
    // The channel can arrive after the stage is already visible (e.g. event
    // livestreams fetch the live chat only once the room goes live). Show a
    // loading skeleton with a disabled composer so the chat column matches the
    // loaded layout instead of popping in once the channel resolves.
    if (isLoading) {
      return (
        <div className={styles.livestreamChat__container}>
          <div className={styles.livestreamChat__container__inner}>
            <div className={styles.livestreamChat__chatFeedWrapper}>
              <div className={styles.livestreamChat__loadingSkeleton}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <MessageBubbleSkeleton key={index} />
                ))}
              </div>
            </div>
            <LivestreamChatMessageComposer
              pageId={pageId}
              community={community}
              disabled
              isChannelPending
              isPlayer={isPlayer}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  const isPending = isPendingPost || post?.feedType === 'reviewing';
  const disableComposer =
    isLoading || room?.status === liveStreamStatus.ended || disabled || isPending;

  return (
    <div className={styles.livestreamChat__container}>
      <div className={styles.livestreamChat__container__inner}>
        <div className={styles.livestreamChat__chatFeedWrapper}>
          <ChatFeed
            pageId={pageId}
            componentId={componentId}
            channel={channel}
            isJoinedCommunity={!!community?.isJoined}
            isLoading={isLoading || isPoorConnection}
          />
          {!isPending && (
            <div className={styles.livestreamChat__chatFeedWrapper__pinnedProduct}>
              <PinnedProductOverlay pageId={pageId} componentId={componentId} />
            </div>
          )}
        </div>
        <LivestreamChatMessageComposer
          pageId={pageId}
          channelId={channel.channelId}
          disabled={disableComposer}
          community={community}
          isPendingPost={isPending}
          isPlayer={isPlayer}
        />
      </div>
    </div>
  );
};
