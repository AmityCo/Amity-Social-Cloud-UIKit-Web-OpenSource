import { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { EmptyClipFeed } from '~/v4/social/elements/EmptyClipFeed';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { ClipGallery } from '~/v4/social/internal-components/ClipGallery/ClipGallery';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type CommunityClipFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityClipFeed = ({ pageId = '*', communityId }: CommunityClipFeedProps) => {
  const componentId = COMPONENT_ID.COMMUNITY_CLIP_FEED;

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    feedType: 'published',
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['clip'],
  });

  if (isExcluded) return null;

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        {posts?.length === 0 && !isLoading && <EmptyClipFeed />}
        {posts?.length > 0 && (
          <ClipGallery
            pageId={pageId}
            componentId={communityId}
            posts={posts as Amity.Post<'clip'>[]}
          />
        )}
        {isLoading && <MediaFeedSkeleton />}
        {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
      </NoInternetConnectionHoc>
    </div>
  );
};
