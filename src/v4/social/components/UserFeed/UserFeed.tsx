import React, { useMemo, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import {
  PostContent,
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyUserFeed } from '~/v4/social/elements/EmptyUserFeed';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { BlockedUserFeed } from '~/v4/social/elements/BlockedUserFeed/BlockedUserFeed';
import { PrivateUserFeed } from '~/v4/social/elements/PrivateUserFeed/PrivateUserFeed';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './UserFeed.module.css';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import { FeedDataTypeEnum, FeedSourceEnum } from '@amityco/ts-sdk';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

interface UserFeedProps {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
  targetUserPostsOnly?: boolean;
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

export const UserFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
  targetUserPostsOnly = false,
}: UserFeedProps) => {
  const componentId = 'user_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { AmityUserFeedComponentBehavior } = usePageBehavior();
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const dataTypes = useMemo(() => {
    return [
      FeedDataTypeEnum.Text,
      FeedDataTypeEnum.Image,
      FeedDataTypeEnum.Video,
      FeedDataTypeEnum.Poll,
      FeedDataTypeEnum.Clip,
      FeedDataTypeEnum.LiveStream,
    ];
  }, []);

  const { posts, hasMore, loadMore, refresh, isLoading, error } = useUserFeed({
    userId,
    feedSources,
    matchingOnlyParentPost: true,
    dataTypes,
  });

  const visiblePosts = useMemo(() => {
    if (!targetUserPostsOnly) return posts;

    return posts.filter(
      (post) =>
        post.targetType === 'user' &&
        (post.targetId === userId || (!post.targetId && post.postedUserId === userId)),
    );
  }, [posts, targetUserPostsOnly, userId]);

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

  const renderUserFeed = () => {
    if (!isLoading && followStatus === 'blocked')
      return <BlockedUserFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return <PrivateUserFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error) return <ErrorContent />;

    if (!isLoading && visiblePosts.length === 0)
      return <EmptyUserFeed pageId={pageId} componentId={componentId} />;

    return visiblePosts.map((post) => (
      <div key={post.postId} className={styles.userFeed__postContent}>
        <PostContent
          category={AmityPostCategory.GENERAL}
          pageId={pageId}
          key={post.postId}
          post={post}
          style={AmityPostContentComponentStyle.FEED}
          onPollPostDeleted={() => refresh()}
          onClick={(context) => {
            AmityUserFeedComponentBehavior?.goToPostDetailPage?.({
              postId: post.postId,
              commentId: context?.commentId,
              parentId: context?.parentId,
              selectedReplyComment: context?.selectedReplyComment,
              showReplyCommentAt: context?.showReplyCommentAt,
              isFromCommentClick: context?.isFromCommentClick,
            });
          }}
        />
      </div>
    ));
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.userFeed}>
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
