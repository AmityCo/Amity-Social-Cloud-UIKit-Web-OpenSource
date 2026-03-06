import React from 'react';
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { LivestreamChatMessageComposer } from '~/v4/social/features/livestream/components/LivestreamChatMessageComposer';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import styles from './LivestreamChat.module.css';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { usePostSubscription } from '~/v4/social/features/livestream/hooks';
import { PinnedProductOverlay } from '~/v4/social/features/product-tagged/internal-components';

export interface LivestreamChatProps {
  pageId: string;
  community?: Amity.Community | null;
  isPoorConnection?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isPlayer?: boolean;
}

export const LivestreamChat: React.FC<LivestreamChatProps> = ({
  pageId,
  community,
  isPoorConnection = false,
  isLoading = false,
  disabled = false,
  isPlayer = false,
}) => {
  // Get values from context
  const { channel, room, livestreamPost: post } = useLivestreamData();
  const { post: subscribedParentPost } = usePostSubscription(post?.postId);
  const componentId = COMPONENT_ID.LIVESTREAM_CHAT;

  if (!channel || !post) {
    return null;
  }

  const isPendingPost = subscribedParentPost?.feedType === 'reviewing';

  const disableComposer =
    isLoading || room?.status === liveStreamStatus.ended || disabled || isPendingPost;

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
          <div className={styles.livestreamChat__chatFeedWrapper__pinnedProduct}>
            <PinnedProductOverlay pageId={pageId} componentId={componentId} />
          </div>
        </div>
        <LivestreamChatMessageComposer
          pageId={pageId}
          channelId={channel.channelId}
          disabled={disableComposer}
          community={community}
          isPendingPost={isPendingPost}
          isPlayer={isPlayer}
        />
      </div>
    </div>
  );
};
