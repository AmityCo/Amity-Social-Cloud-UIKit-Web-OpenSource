import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import {
  PostContent,
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';

import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { Button } from '~/v4/core/natives/Button/Button';
import { EmptyUserFeed } from '~/v4/social/elements/EmptyUserFeed';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { BlockedUserFeed } from '~/v4/social/elements/BlockedUserFeed/BlockedUserFeed';
import { PrivateUserFeed } from '~/v4/social/elements/PrivateUserFeed/PrivateUserFeed';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './UserFeed.module.css';

interface UserFeedProps {
  userId: string;
  pageId?: string;
}

const UserFeedPostContentSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles.userFeed_postSkeleton__post}>
          <div className={styles.userFeed_postSkeleton__post__header}>
            <div className={styles.userFeed_postSkeleton__post__avatar}></div>
            <div className={styles.userFeed_postSkeleton__post__headerText_wrap}>
              <div className={styles.userFeed_postSkeleton__post__displayName}></div>
              <div className={styles.userFeed_postSkeleton__post__timestamp}></div>
            </div>
          </div>
          <div>
            <div className={styles.userFeed_postSkeleton__post__content}></div>
            <div className={styles.userFeed_postSkeleton__post__content}></div>
            <div className={styles.userFeed_postSkeleton__post__content}></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const UserFeed = ({ pageId = '*', userId }: UserFeedProps) => {
  const componentId = 'user_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { AmityUserFeedComponentBehavior } = usePageBehavior();
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading, error } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: 10,
  });

  const { followStatus } = useFollowCount(userId);

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

  const renderUserFeed = () => {
    if (followStatus === 'blocked')
      return <BlockedUserFeed pageId={pageId} componentId={componentId} />;

    if (error && error.message.includes('You are not following this user'))
      return <PrivateUserFeed pageId={pageId} componentId={componentId} />;

    if (error) return <ErrorContent />;

    if (!isLoading && posts.length === 0)
      return <EmptyUserFeed pageId={pageId} componentId={componentId} />;

    return posts.map((post) => (
      <Button
        key={post.postId}
        className={styles.userFeed__postContent}
        onPress={() =>
          AmityUserFeedComponentBehavior?.goToPostDetailPage?.({
            postId: post.postId,
          })
        }
      >
        <PostContent
          category={AmityPostCategory.GENERAL}
          pageId={pageId}
          key={post.postId}
          post={post}
          style={AmityPostContentComponentStyle.FEED}
          onClick={() =>
            AmityUserFeedComponentBehavior?.goToPostDetailPage?.({
              postId: post.postId,
            })
          }
        />
      </Button>
    ));
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <div className={styles.userFeed__container}>
          {renderUserFeed()}
          {isLoading && <UserFeedPostContentSkeleton />}
          {hasMore && (
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.userFeed__observerTarget}
            />
          )}
        </div>
      </NoInternetConnectionHoc>
    </div>
  );
};
