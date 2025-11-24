import React from 'react';
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { LivestreamChatMessageComposer } from '~/v4/social/features/livestream/components/LivestreamChatMessageComposer';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import styles from './LivestreamChat.module.css';

export interface LivestreamChatProps {
  pageId: string;
  community?: Amity.Community | null;
  isPoorConnection?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const LivestreamChat: React.FC<LivestreamChatProps> = ({
  pageId,
  community,
  isPoorConnection = false,
  isLoading = false,
  disabled = false,
}) => {
  // Get values from context
  const { channel, room, livestreamPost: post } = useLivestreamData();

  if (!channel || !post) {
    return null;
  }

  const isPendingPost = post.feedType === 'reviewing';

  const disableComposer =
    isLoading || room?.status === liveStreamStatus.ended || disabled || isPendingPost;

  return (
    <div className={styles.livestreamChat__container}>
      <div className={styles.livestreamChat__container__inner}>
        <ChatFeed
          channel={channel}
          isJoinedCommunity={!!community?.isJoined}
          isLoading={isLoading || isPoorConnection}
        />
        <LivestreamChatMessageComposer
          pageId={pageId}
          channelId={channel.channelId}
          disabled={disableComposer}
          community={community}
          isPendingPost={isPendingPost}
        />
      </div>
    </div>
  );
};
