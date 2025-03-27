import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyCommunityVideoFeed } from '~/v4/social/elements/EmptyCommunityVideoFeed';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './CommunityVideoFeed.module.css';

type CommunityVideoFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityVideoFeed = ({ pageId = '*', communityId }: CommunityVideoFeedProps) => {
  const componentId = 'community_video_feed';

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
    dataTypes: ['video'],
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
      <div className={styles.communityVideoFeed__containerSkeleton}>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
      </div>
    );
  };

  if (!(isMemberPrivateCommunity || community?.isPublic))
    return (
      <div className={styles.communityVideoFeed__lock}>
        <LockPrivateContent />
      </div>
    );

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <div className={styles.communityVideoFeed__container}>
          {posts?.length === 0 && !isLoading && (
            <EmptyCommunityVideoFeed pageId={pageId} componentId={componentId} />
          )}
          {posts?.length > 0 && (
            <VideoGallery posts={posts} pageId={pageId} componentId={communityId} />
          )}
          {isLoading && renderLoading()}
        </div>
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
