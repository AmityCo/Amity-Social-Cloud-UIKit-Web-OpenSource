import { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { FeedSourceEnum, FeedDataTypeEnum } from '@amityco/ts-sdk';
import { EmptyClipFeed } from '~/v4/social/elements/EmptyClipFeed';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import { BlockedUserMediaFeed } from '~/v4/social/elements/BlockedUserMediaFeed';
import { ClipGallery } from '~/v4/social/internal-components/ClipGallery/ClipGallery';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { PrivateUserMediaFeed } from '~/v4/social/elements/PrivateUserMediaFeed';

type UserClipFeedProps = {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
};

export const UserClipFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserClipFeedProps) => {
  const componentId = COMPONENT_ID.USER_CLIP_FEED;

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, error, isLoading } = useUserFeed({
    userId,
    limit: 10,
    feedSources,
    dataTypes: [FeedDataTypeEnum.Clip],
  });

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  const renderContent = () => {
    if (!isLoading && followStatus === 'blocked')
      return (
        <BlockedUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.BLOCKED_USER_CLIP_FEED}
          infoElementId={ELEMENT_ID.BLOCKED_USER_CLIP_FEED_INFO}
        />
      );

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return (
        <PrivateUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.PRIVATE_USER_CLIP_FEED}
          infoElementId={ELEMENT_ID.PRIVATE_USER_CLIP_FEED_INFO}
        />
      );

    if (!isLoading && error) return <ErrorContent type="media" />;

    if (!isLoading && !posts.length) return <EmptyClipFeed />;

    return (
      <>
        <ClipGallery posts={posts as Amity.Post<'clip'>[]} />
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
