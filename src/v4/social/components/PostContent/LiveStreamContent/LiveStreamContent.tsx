import React, { useEffect, useRef, useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import VideoControl from '~/v4/icons/VideoControl';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { LiveStreamThumbnail } from '~/v4/social/internal-components/LiveStreamThumbnail';
import { LiveStreamLiveBadge } from '~/v4/social/internal-components/LiveStreamLiveBadge';
import { LiveStreamEndThumbnail } from '~/v4/social/internal-components/LiveStreamEndThumbnail';
import { LiveStreamIdleThumbnail } from '~/v4/social/internal-components/LiveStreamIdleThumbnail';
import { LiveStreamUpcomingBadge } from '~/v4/social/internal-components/LiveStreamUpcomingBadge';
import { LiveStreamRecordedBadge } from '~/v4/social/internal-components/LiveStreamRecordedBadge';
import styles from './LiveStreamContent.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { LiveStreamBanThumbnail } from '~/v4/social/internal-components/LiveStreamBanThumbnail/LiveStreamBanThumbnail';
import { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';

type LiveStreamContentProps = {
  parentPost: Amity.Post;
  posts: Amity.Post<'liveStream'>[];
  goToPostDetail?: (
    context?: Pick<
      PostDetailPageProps,
      'commentId' | 'selectedReplyComment' | 'parentId' | 'showReplyCommentAt'
    >,
  ) => void;
};

export function LiveStreamContent({ parentPost, posts, goToPostDetail }: LiveStreamContentProps) {
  const { goToLiveStreamPlayerPage } = useNavigation();
  const [isUpcoming, setIsUpcoming] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stream = posts?.[0]?.getLivestreamInfo();

  const { currentUserId } = useSDK();
  const { community } = useCommunity({
    communityId: parentPost.targetId,
  });

  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
  });

  const myMembership = members.find((member) => member.userId === currentUserId);
  const isUserBanned = stream?.isBanned || (myMembership && myMembership.isBanned);

  useEffect(() => {
    const updateUpcomingStatus = () => {
      if (
        stream?.startedAt &&
        (stream.status === liveStreamStatus.idle || stream.status === liveStreamStatus.live)
      ) {
        const delay = 15000;
        const timeSinceStart = new Date().getTime() - new Date(stream.startedAt).getTime();
        const isWithinTimeWindow = timeSinceStart < delay;
        setIsUpcoming(isWithinTimeWindow);

        if (isWithinTimeWindow) {
          const timeToNextCheck = delay - timeSinceStart + 50;
          timerRef.current = setTimeout(() => {
            setIsUpcoming(false);
          }, timeToNextCheck);
        }
      } else {
        setIsUpcoming(false);
      }
    };

    updateUpcomingStatus();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stream]);

  if (!posts || posts[0]?.dataType !== 'liveStream' || !stream) return null;

  if (isUserBanned) return <LiveStreamBanThumbnail />;

  if (stream.isDeleted) return <LiveStreamIdleThumbnail />;

  if (stream.status === liveStreamStatus.ended) return <LiveStreamEndThumbnail />;

  return (
    <Button
      className={styles.liveStreamContent}
      data-idle={stream.status === liveStreamStatus.idle || isUpcoming}
      onPress={() => {
        if (stream.status !== liveStreamStatus.idle && !isUpcoming) {
          goToLiveStreamPlayerPage?.({ post: parentPost, goToDetailPage: goToPostDetail });
        }
      }}
    >
      <LiveStreamThumbnail fileId={stream.thumbnailFileId} alt={stream.title} />
      {(stream.status === liveStreamStatus.idle || isUpcoming) && <LiveStreamUpcomingBadge />}
      {stream.status === liveStreamStatus.live && !isUpcoming && <LiveStreamLiveBadge />}
      {stream.status === liveStreamStatus.recorded && <LiveStreamRecordedBadge />}

      {stream.status !== liveStreamStatus.idle && !isUpcoming && (
        <VideoControl className={styles.liveStreamContent__playButton} />
      )}
    </Button>
  );
}
