import React, { useMemo, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useModuleFilteredPosts } from '~/v4/social/hooks/useModuleFilteredPosts';
import {
  PostContent,
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { Button } from '~/v4/core/natives/Button/Button';
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

export const UserFeed = ({ pageId = '*', userId, feedSources, followStatus }: UserFeedProps) => {
  const componentId = 'user_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { AmityUserFeedComponentBehavior } = usePageBehavior();
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  // See CommunityFeed: with matchingOnlyParentPost true, leaving a type out of
  // this list does not remove posts that carry it in a child, so the list stays
  // whole and the filter below does the work.
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

  const {
    posts: feedPosts,
    hasMore,
    loadMore,
    refresh,
    isLoading,
    error,
  } = useUserFeed({
    userId,
    feedSources,
    // true, matching Android everywhere and iOS's default. iOS passes false in
    // one place only — MediaFeedViewModel, where the point is to match a child
    // type — and a general feed is not that. The livestream post that reached
    // this feed is taken out below instead.
    matchingOnlyParentPost: true,
    dataTypes,
  });

  // See CommunityFeed: the request names its types, and this does not depend
  // on how the server matches them.
  const posts = useModuleFilteredPosts(feedPosts);

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

  // Owned by a module and never asked. The component kept rendering
  // after its module was switched off.
  if (isExcluded) return null;

  const renderUserFeed = () => {
    if (!isLoading && followStatus === 'blocked')
      return <BlockedUserFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return <PrivateUserFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error) return <ErrorContent />;

    if (!isLoading && posts.length === 0)
      return <EmptyUserFeed pageId={pageId} componentId={componentId} />;

    return posts.map((post) => (
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
