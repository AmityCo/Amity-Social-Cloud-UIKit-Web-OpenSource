import { Button } from '~/v4/core/natives/Button';
import VideoControl from '~/v4/icons/VideoControl';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import {
  LiveStreamThumbnail,
  LiveStreamLiveBadge,
  LiveStreamEndThumbnail,
  LiveStreamIdleThumbnail,
  LiveStreamUpcomingBadge,
  LiveStreamRecordedBadge,
  LiveStreamBanThumbnail,
} from '~/v4/social/features/livestream/internal-components';
import styles from './LiveStreamContent.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import { useRoomSubscription, useRoom } from '~/v4/social/features/livestream/hooks';
import clsx from 'clsx';

type LiveStreamContentProps = {
  roomId?: string;
  className?: string;
  parentPost: Amity.Post;
  posts?: Amity.Post<'room'>[];
  goToPostDetail?: (
    context?: Pick<
      PostDetailPageProps,
      'commentId' | 'selectedReplyComment' | 'parentId' | 'showReplyCommentAt'
    >,
  ) => void;
};

export function LiveStreamContent({
  parentPost,
  posts,
  roomId,
  goToPostDetail,
  className,
}: LiveStreamContentProps) {
  const { goToLiveStreamPlayerPage } = useNavigation();
  const { room } = useRoom(roomId ?? posts?.[0]?.getRoomInfo()?.roomId);
  const { currentUserId } = useSDK();
  const { community } = useCommunity({
    communityId: parentPost?.targetId,
  });
  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
  });

  const myMembership = members.find((member) => member.userId === currentUserId);
  // const isUserBanned = stream?.isBanned || (myMembership && myMembership.isBanned);
  const isUserBanned = false;

  useRoomSubscription({ room });

  if (!roomId && !posts) return null;

  if (posts && posts[0]?.dataType !== 'room') return null;

  if (!room) return null;

  if (isUserBanned) return <LiveStreamBanThumbnail />;

  if (room.isDeleted) return <LiveStreamIdleThumbnail />;

  if (room.status === liveStreamStatus.ended) return <LiveStreamEndThumbnail />;

  return (
    <Button
      className={clsx(styles.liveStreamContent, className)}
      data-idle={room.status === liveStreamStatus.idle}
      onPress={() => {
        if (room.status !== liveStreamStatus.idle) {
          goToLiveStreamPlayerPage?.({ post: parentPost, goToDetailPage: goToPostDetail });
        }
      }}
    >
      <LiveStreamThumbnail fileId={room.thumbnailFileId} alt={room.title} />
      {room.status === liveStreamStatus.idle && (
        <div className={styles.liveStreamContent__statusBadge}>
          <LiveStreamUpcomingBadge />
        </div>
      )}
      {room.status === liveStreamStatus.live && (
        <div className={styles.liveStreamContent__statusBadge}>
          <LiveStreamLiveBadge />
        </div>
      )}
      {room.status === liveStreamStatus.recorded && (
        <div className={styles.liveStreamContent__statusBadge}>
          <LiveStreamRecordedBadge />
        </div>
      )}
      {room.status !== liveStreamStatus.idle && (
        <VideoControl className={styles.liveStreamContent__playButton} />
      )}
    </Button>
  );
}
