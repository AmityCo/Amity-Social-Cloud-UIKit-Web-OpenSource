import { useEffect, useRef, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { FeedSourceEnum, FeedDataTypeEnum } from '@amityco/ts-sdk';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { EmptyVideoFeed } from '~/v4/social/elements/EmptyVideoFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import { PrivateUserMediaFeed } from '~/v4/social/elements/PrivateUserMediaFeed';
import { BlockedUserMediaFeed } from '~/v4/social/elements/BlockedUserMediaFeed';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type UserVideoFeedProps = {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
};

export const UserVideoFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserVideoFeedProps) => {
  const componentId = COMPONENT_ID.USER_VIDEO_FEED;

  const { linkToPost, setLinkToPost } = useLayoutContext();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const limit = useRef(linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10);

  const { posts, hasMore, loadMore, refresh, error, isLoading } = useUserFeed({
    userId,
    feedSources,
    limit: limit.current,
    dataTypes: [FeedDataTypeEnum.Video],
  });

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  const renderContent = () => {
    if (!isLoading && followStatus === 'blocked')
      return (
        <BlockedUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.BLOCKED_USER_VIDEO_FEED}
          infoElementId={ELEMENT_ID.BLOCKED_USER_VIDEO_FEED_INFO}
          textKey="amity_social_label_blocked_user_video_feed"
          infoTextKey="amity_social_label_blocked_user_video_feed_info"
        />
      );

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return (
        <PrivateUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.PRIVATE_USER_VIDEO_FEED}
          infoElementId={ELEMENT_ID.PRIVATE_USER_VIDEO_FEED_INFO}
          textKey="amity_social_label_private_user_video_feed"
          infoTextKey="amity_social_label_private_user_video_feed_info"
        />
      );

    if (!isLoading && error) return <ErrorContent type="media" />;

    if (!isLoading && !posts.length) return <EmptyVideoFeed />;

    return (
      <>
        <VideoGallery
          isLoading={isLoading}
          feedSources={feedSources}
          posts={posts as Amity.Post<'video'>[]}
        />
        {isLoading && <MediaFeedSkeleton />}
        {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
      </>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        {renderContent()}
      </NoInternetConnectionHoc>
    </div>
  );
};
