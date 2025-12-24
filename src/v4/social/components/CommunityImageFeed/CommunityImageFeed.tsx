import { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { EmptyImageFeed } from '~/v4/social/elements/EmptyImageFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/Skeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type CommunityImageFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityImageFeed = ({ pageId = '*', communityId }: CommunityImageFeedProps) => {
  const componentId = COMPONENT_ID.COMMUNITY_IMAGE_FEED;

  const { linkToPost, setLinkToPost } = useLayoutContext();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    dataTypes: ['image'],
    feedType: 'published',
    targetType: 'community',
    limit: linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10,
  });

  if (isExcluded) return null;

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  const renderContent = () => {
    if (posts?.length === 0 && !isLoading) return <EmptyImageFeed />;
    return (
      <>
        <ImageGallery
          pageId={pageId}
          target="community"
          isLoading={isLoading}
          componentId={componentId}
          posts={posts as Amity.Post<'image'>[]}
        />
        {isLoading && <MediaFeedSkeleton />}
        {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
      </>
    );
  };

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        {renderContent()}
      </NoInternetConnectionHoc>
    </div>
  );
};
