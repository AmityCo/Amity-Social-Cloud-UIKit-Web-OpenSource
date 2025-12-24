import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID, ELEMENT_ID } from '~/v4/constants/customization';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FeedSourceEnum, FeedDataTypeEnum } from '@amityco/ts-sdk';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { EmptyImageFeed } from '~/v4/social/elements/EmptyImageFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserMediaFeed } from '~/v4/social/elements/PrivateUserMediaFeed';
import { BlockedUserMediaFeed } from '~/v4/social/elements/BlockedUserMediaFeed';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type UserImageFeedProps = {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
};

export const UserImageFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserImageFeedProps) => {
  const componentId = COMPONENT_ID.USER_IMAGE_FEED;

  const { linkToPost, setLinkToPost } = useLayoutContext();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const limit = useRef(linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10);

  const dataTypes = useMemo(() => [FeedDataTypeEnum.Image], []);

  const { posts, hasMore, loadMore, refresh, error, isLoading } = useUserFeed({
    userId,
    dataTypes,
    feedSources,
    limit: limit.current,
  });

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  const renderImageFeed = () => {
    if (!isLoading && followStatus === 'blocked')
      return (
        <BlockedUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.BLOCKED_USER_IMAGE_FEED}
          infoElementId={ELEMENT_ID.BLOCKED_USER_IMAGE_FEED_INFO}
        />
      );

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return (
        <PrivateUserMediaFeed
          pageId={pageId}
          componentId={componentId}
          elementId={ELEMENT_ID.PRIVATE_USER_IMAGE_FEED}
          infoElementId={ELEMENT_ID.PRIVATE_USER_IMAGE_FEED_INFO}
        />
      );

    if (!isLoading && error) return <ErrorContent type="media" />;

    if (!isLoading && !posts.length) return <EmptyImageFeed />;

    return (
      <>
        <ImageGallery
          target="user"
          isLoading={isLoading}
          feedSources={feedSources}
          posts={posts as Amity.Post<'image'>[]}
        />
        {isLoading && <MediaFeedSkeleton />}
        {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
      </>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        {renderImageFeed()}
      </NoInternetConnectionHoc>
    </div>
  );
};
