import React, { useEffect, useRef, useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import VideoControl from '~/v4/icons/VideoControl';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { LiveStreamThumbnail } from '~/v4/social/internal-components/LiveStreamThumbnail';
import { LiveStreamLiveBadge } from '~/v4/social/internal-components/LiveStreamLiveBadge';
import { LiveStreamEndThumbnail } from '~/v4/social/internal-components/LiveStreamEndThumbnail';
import { LiveStreamIdleThumbnail } from '~/v4/social/internal-components/LiveStreamIdleThumbnail';
import { LiveStreamUpcomingBadge } from '~/v4/social/internal-components/LiveStreamUpcomingBadge';
import { LiveStreamRecordedBadge } from '~/v4/social/internal-components/LiveStreamRecordedBadge';
import styles from './LiveStreamContent.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type LiveStreamContentProps = {
  post: Amity.Post;
  goToPostDetail?: () => void;
};

export function LiveStreamContent({ post, goToPostDetail }: LiveStreamContentProps) {
  const { goToLiveStreamPlayerPage } = useNavigation();
  const [isUpcoming, setIsUpcoming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { post: childPost, isLoading } = usePost(post.children?.[0]);
  const stream = useStream((childPost as Amity.Post<'liveStream'>)?.data?.streamId);

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

  if (isLoading || childPost?.dataType !== 'liveStream' || !stream) return null;

  if (stream.isDeleted) return <LiveStreamIdleThumbnail />;

  if (stream.status === liveStreamStatus.ended) return <LiveStreamEndThumbnail />;

  return (
    <Button
      className={styles.liveStreamContent}
      data-idle={stream.status === liveStreamStatus.idle || isUpcoming}
      onPress={() => {
        if (stream.status !== liveStreamStatus.idle && !isUpcoming) {
          goToLiveStreamPlayerPage?.({ post, goToDetailPage: goToPostDetail });
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
