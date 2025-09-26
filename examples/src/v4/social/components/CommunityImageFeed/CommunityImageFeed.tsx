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

type CommunityImageFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityImageFeed = ({ pageId = '*', communityId }: CommunityImageFeedProps) => {
  const componentId = 'community_image_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['image'],
  });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  if (isExcluded) return null;

  useEffect(() => {
    refresh();
  }, []);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  const renderLoading = () => {
    return (
      <div className={styles.communityImageFeed__containerSkeleton}>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
      </div>
    );
  };

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
          {posts?.length > 0 && (
            <ImageGallery
              posts={posts as Amity.Post<'image'>[]}
              pageId={pageId}
              componentId={communityId}
            />
          )}
          {isLoading && renderLoading()}
        </div>
      </NoInternetConnectionHoc>
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
