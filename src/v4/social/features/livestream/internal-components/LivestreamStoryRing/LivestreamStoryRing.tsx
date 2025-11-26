import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './LivestreamStoryRing.module.css';
import Community from '~/v4/icons/Community';
import { UserAvatar } from '~/v4/social/elements';
import { Avatar, Typography } from '~/v4/core/components';
import { LiveStreamLiveBadge } from '~/v4/social/features/livestream/internal-components';
import { LivestreamFill } from '~/v4/icons/LivestreamFill';
import { StoryTabDisplayName } from '~/v4/social/components/StoryTab/StoryTabDisplayName';
import { PAGE_ID, COMPONENT_ID } from '~/v4/constants/customization';
import { useRoomSubscription } from '~/v4/social/features/livestream/hooks';
import { useEvent } from '~/v4/social/features/events/hooks';
import DefaultEventThumbnail from '~/v4/icons/DefaultEventThumbnail';

export interface LivestreamStoryRingProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  post?: Amity.Post;
  type?: 'globalFeed' | 'community';
  onClick?: () => void;
}

export function LivestreamStoryRing({
  className,
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  type = 'globalFeed',
  post,
  onClick,
}: LivestreamStoryRingProps) {
  const eventId = post?.childrenPosts?.[0]?.eventId;

  const { event } = useEvent({ eventId: eventId! });

  const communityAvatarUrl = post?.targetCommunity?.avatar?.fileUrl;
  const communityName = post?.targetCommunity?.displayName;

  const eventThumbnailFileUrl = event?.coverImage?.fileUrl;
  const eventTitle = event?.title;

  const name = eventId ? eventTitle : communityName;
  const avatarFileUrl = eventId ? eventThumbnailFileUrl : communityAvatarUrl;

  useRoomSubscription({ room: post?.childrenPosts[0]?.getRoomInfo() });

  const defaultImage = eventId ? (
    <DefaultEventThumbnail className={styles.livestreamHeader__event__thumbnailImage} />
  ) : (
    <Community />
  );

  if (type === 'globalFeed')
    return (
      <div className={clsx(styles.livestreamStoryRing, className)} onClick={onClick}>
        <div className={styles.livestreamStoryRing__ring}>
          <div className={styles.livestreamStoryRing__avatar}>
            <Avatar avatarUrl={avatarFileUrl} defaultImage={defaultImage} />
          </div>
          <LiveStreamLiveBadge size="small" className={styles.livestreamStoryRing__liveBadge} />
          <div className={styles.livestreamStoryRing__userAvatar__container}>
            <UserAvatar
              userData={post?.creator}
              imageContainerClassName={styles.livestreamStoryRing__userAvatar}
              className={styles.livestreamStoryRing__userAvatar}
            />
          </div>
        </div>
        <StoryTabDisplayName
          pageId={pageId}
          componentId={componentId}
          isPublic={post?.targetCommunity?.isPublic}
          displayName={name}
        />
      </div>
    );

  return (
    <div className={clsx(styles.livestreamStoryRing, className)} onClick={onClick}>
      <div className={styles.livestreamStoryRing__ringWrapper}>
        <div className={styles.livestreamStoryRing__ring} data-community={true}>
          <div className={styles.livestreamStoryRing__avatar}>
            <UserAvatar
              userId={post?.postedUserId}
              userData={post?.creator}
              onPressAvatar={onClick}
              imageContainerClassName={styles.livestreamStoryRing__community__userAvatar}
              className={styles.livestreamStoryRing__userAvatar}
            />
          </div>
          <div className={styles.livestreamStoryRing__liveIcon__container}>
            <LivestreamFill className={styles.livestreamStoryRing__liveIcon} />
          </div>
        </div>
      </div>
      <Typography.Caption className={styles.livestreamStoryRing__userName}>
        {post?.creator?.displayName}
      </Typography.Caption>
    </div>
  );
}
