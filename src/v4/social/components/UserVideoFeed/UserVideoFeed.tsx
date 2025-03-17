import React, { useEffect, useState } from 'react';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import { EmptyUserVideoFeed } from '~/v4/social/elements/EmptyUserVideoFeed/EmptyUserVideoFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserVideoFeed } from '~/v4/social/elements/PrivateUserVideoFeed';
import { BlockedUserVideoFeed } from '~/v4/social/elements/BlockedUserVideoFeed';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './UserVideoFeed.module.css';

interface UserVideoFeedProps {
  userId: string;
  pageId?: string;
}

export const UserVideoFeed = ({ pageId = '*', userId }: UserVideoFeedProps) => {
  const componentId = 'user_video_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { followStatus } = useFollowCount(userId);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, error, isLoading } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: 10,
    dataTypes: ['video'],
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  const renderVideoFeed = () => {
    if (followStatus === 'blocked')
      return <BlockedUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (error) {
      return error.message.includes('You are not following this user') ? (
        <PrivateUserVideoFeed pageId={pageId} componentId={componentId} />
      ) : (
        <ErrorContent />
      );
    }
    if (!isLoading && posts.length === 0)
      return <EmptyUserVideoFeed pageId={pageId} componentId={componentId} />;

    return (
      <div className={styles.userVideoFeed__container}>
        <VideoGallery posts={posts} />
      </div>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderVideoFeed()}
          {hasMore && (
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.userVideoFeed__observerTarget}
            />
          )}
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
