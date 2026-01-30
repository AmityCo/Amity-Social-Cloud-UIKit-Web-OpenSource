import { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { EmptyVideoFeed } from '~/v4/social/elements/EmptyVideoFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type CommunityVideoFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityVideoFeed = ({ pageId = '*', communityId }: CommunityVideoFeedProps) => {
  const componentId = COMPONENT_ID.COMMUNITY_VIDEO_FEED;

  const { linkToPost, setLinkToPost } = useLayoutContext();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    dataTypes: ['video'],
    feedType: 'published',
    targetType: 'community',
    limit: linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10,
  });

  if (isExcluded) return null;

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts.length, isLoading]);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        {posts?.length === 0 && !isLoading && <EmptyVideoFeed />}
        <VideoGallery
          pageId={pageId}
          isLoading={isLoading}
          componentId={componentId}
          posts={posts as Amity.Post<'video'>[]}
        />
        {isLoading && <MediaFeedSkeleton />}
        {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
      </NoInternetConnectionHoc>
    </div>
  );
};
