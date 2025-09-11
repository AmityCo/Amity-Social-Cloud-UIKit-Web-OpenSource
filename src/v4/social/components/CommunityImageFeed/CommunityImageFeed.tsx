import React, { useEffect, useState } from 'react';
import styles from './CommunityImageFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyCommunityImageFeed } from '~/v4/social/elements/EmptyCommunityImageFeed';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/MediaFeedSkeleton';

type CommunityImageFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityImageFeed = ({ pageId = '*', communityId }: CommunityImageFeedProps) => {
  const componentId = 'community_image_feed';
  const { linkToPost, setLinkToPost } = useLayoutContext();
  const { community } = useCommunity({ communityId, shouldCall: !!communityId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10,
    dataTypes: ['image'],
    feedType: 'published',
  });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  if (isExcluded) return null;

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  if (!(isMemberPrivateCommunity || community?.isPublic))
    return (
      <div className={styles.communityImageFeed__lock}>
        <LockPrivateContent />
      </div>
    );

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <div className={styles.communityImageFeed__container}>
          {posts?.length === 0 && !isLoading && (
            <EmptyCommunityImageFeed pageId={pageId} componentId={componentId} />
          )}
          <ImageGallery
            isLoading={isLoading}
            target="community"
            posts={posts as Amity.Post<'image'>[]}
            pageId={pageId}
            componentId={componentId}
          />
          {isLoading && <MediaFeedSkeleton />}
        </div>
      </NoInternetConnectionHoc>
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
