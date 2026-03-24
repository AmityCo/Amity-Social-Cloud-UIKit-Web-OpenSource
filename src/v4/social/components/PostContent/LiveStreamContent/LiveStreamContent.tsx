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
  LiveStreamTerminatedThumbnail,
} from '~/v4/social/features/livestream/internal-components';
import styles from './LiveStreamContent.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import {
  usePostSubscription,
  useRoomSubscription,
  useRoom,
} from '~/v4/social/features/livestream/hooks';
import clsx from 'clsx';
import { TaggedProductIcon } from '~/v4/social/features/livestream/internal-components/TaggedProductIcon/TaggedProductIcon';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks/useShowProductTagList';

type LiveStreamContentProps = {
  pageId?: string;
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
  pageId = '*',
  parentPost,
  posts,
  roomId,
  goToPostDetail,
  className,
}: LiveStreamContentProps) {
  const { goToLiveStreamPlayerPage } = useNavigation();
  const { room } = useRoom(roomId ?? posts?.[0]?.getRoomInfo()?.roomId);
  const { post: subscribedPost } = usePostSubscription(parentPost?.childrenPosts[0]?.postId);

  const { productCatalogueSettings } = useProductCatalogueSettings();
  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: 'livestream',
    sourceId: roomId ?? room?.roomId ?? '',
  });

  const { currentUserId } = useSDK();
  const { community } = useCommunity({
    communityId: parentPost.targetType === 'community' ? parentPost?.targetId : null,
  });
  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
  });

  const canShowProductTags =
    (subscribedPost?.productTags?.length ?? 0) > 0 && productCatalogueSettings?.product.enabled;

  const myMembership = members.find((member) => member.userId === currentUserId);
  // const isUserBanned = stream?.isBanned || (myMembership && myMembership.isBanned);
  const isUserBanned = false;

  const resolution =
    room?.status === 'live' || room?.status === 'ended'
      ? room?.liveResolution
      : room?.recordedResolution;

  useRoomSubscription({ room });

  if (!roomId && !posts) return null;

  if (posts && posts[0]?.dataType !== 'room') return null;

  if (!room) return null;

  if (isUserBanned) return <LiveStreamBanThumbnail />;

  if (room.isDeleted) return <LiveStreamIdleThumbnail />;

  if (room.status === liveStreamStatus.ended)
    return <LiveStreamEndThumbnail resolution={resolution} />;

  if (room.moderation?.terminateLabels && room.moderation?.terminateLabels.length > 0)
    return <LiveStreamTerminatedThumbnail />;

  const renderProductTags = () => {
    if (!canShowProductTags) return null;
    return (
      // Intercept the native click so it doesn't bubble to the parent Button and trigger navigation
      <div role="presentation" onClick={(e) => e.stopPropagation()}>
        <TaggedProductIcon
          onPress={() => {
            showProductTagList(subscribedPost?.productTags as Amity.ProductTag[]);
          }}
          className={styles.liveStreamContent__taggedProducts}
          productTagAmount={subscribedPost?.productTags?.length || 0}
        />
      </div>
    );
  };

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
      <LiveStreamThumbnail
        fileId={room.thumbnailFileId}
        alt={room.title}
        status={room.status}
        liveThumbnailUrl={room.liveThumbnailUrl}
        recordedThumbnailUrl={room.recordedPlaybackInfos?.[0]?.thumbnailUrl}
        resolution={resolution}
      />
      {room.status === liveStreamStatus.idle && (
        <div className={styles.liveStreamContent__statusBadge}>
          <LiveStreamUpcomingBadge />
        </div>
      )}
      {room.status === liveStreamStatus.live && (
        <>
          <div className={styles.liveStreamContent__statusBadge}>
            <LiveStreamLiveBadge />
          </div>
          {renderProductTags()}
        </>
      )}
      {room.status === liveStreamStatus.recorded && (
        <>
          <div className={styles.liveStreamContent__statusBadge}>
            <LiveStreamRecordedBadge />
          </div>
          {renderProductTags()}
        </>
      )}

      {room.status === liveStreamStatus.error && renderProductTags()}

      {room.status !== liveStreamStatus.idle && (
        <VideoControl className={styles.liveStreamContent__playButton} />
      )}
    </Button>
  );
}
