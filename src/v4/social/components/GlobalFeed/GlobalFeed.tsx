import React, { useState } from 'react';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed/EmptyNewsFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostAd } from '~/v4/social/internal-components/PostAd/PostAd';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import { ClickableArea } from '~/v4/core/natives/ClickableArea';
import styles from './GlobalFeed.module.css';
import { Divider } from '~/v4/social/elements/Divider';
import useGlobalPinnedPostsCollection from '~/v4/social/hooks/collections/useGlobalPinnedPostsCollection';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

interface GlobalFeedProps {
  pageId?: string;
  componentId?: string;
  items: Array<Amity.Post | Amity.Ad>;
  globalFeaturedPosts?: Array<Amity.PinnedPost>;
  isLoading: boolean;
  isGlobalFeaturedPostsLoading?: boolean;
  onFeedReachBottom: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
}

const isAmityAd = (item: Amity.Post | Amity.Ad): item is Amity.Ad => {
  return (item as Amity.Ad)?.adId !== undefined;
};

export const GlobalFeed = ({
  pageId = '*',
  componentId = '*',
  items,
  isLoading,
  globalFeaturedPosts,
  isGlobalFeaturedPostsLoading,
  onFeedReachBottom,
  onPostDeleted,
}: GlobalFeedProps) => {
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { isDesktop } = useResponsive();

  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      onFeedReachBottom();
    },
  });

  if (
    !isLoading &&
    items.length === 0 &&
    !isGlobalFeaturedPostsLoading &&
    globalFeaturedPosts?.length === 0
  ) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  const getItemKey = (item: Amity.Post | Amity.Ad, prevItem: Amity.Post | Amity.Ad | undefined) => {
    if (isAmityAd(item)) {
      if (prevItem && isAmityAd(prevItem)) return `${prevItem.adId}-${item.adId}`;
      if (prevItem) return `${prevItem.postId}-${item.adId}`;
    } else return item.postId;
  };

  // Create a Set of post IDs from globalFeaturedPosts for efficient lookup
  const featuredPostIds = new Set(globalFeaturedPosts?.map((item) => item.post?.postId) || []);

  // Filter out items that are already in globalFeaturedPosts
  const filteredItems = items.filter((item) => {
    // Only apply this filter to posts (not ads)
    if (!isAmityAd(item)) {
      return !featuredPostIds.has(item.postId);
    }
    // Keep all ads
    return true;
  });

  return (
    <div className={styles.global_feed} style={themeStyles} data-testid={accessibilityId}>
      {globalFeaturedPosts &&
        globalFeaturedPosts.map((item) => {
          if (!item.post) return null;

          return (
            <React.Fragment key={item.post.postId}>
              <ClickableArea
                elementType="div"
                className={styles.global_feed__postContainer}
                onPress={() =>
                  AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
                    hideTarget: true,
                    postId: item.post?.postId as string,
                    category: AmityPostCategory.ANNOUNCEMENT,
                  })
                }
              >
                <PostContent
                  pageId={pageId}
                  post={item.post}
                  category={AmityPostCategory.ANNOUNCEMENT}
                  style={AmityPostContentComponentStyle.FEED}
                  isGlobalFeaturePost={true}
                  onPostDeleted={() => onPostDeleted?.(item.post!)}
                  onPollPostDeleted={onPostDeleted}
                  onClick={(context) => {
                    AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
                      hideTarget: true,
                      postId: item.post?.postId as string,
                      category: AmityPostCategory.ANNOUNCEMENT,
                      commentId: context?.commentId,
                      parentId: context?.parentId,
                      selectedReplyComment: context?.selectedReplyComment,
                      showReplyCommentAt: context?.showReplyCommentAt,
                    });
                  }}
                />
              </ClickableArea>
              <Divider isShown={!isDesktop} />
            </React.Fragment>
          );
        })}
      {filteredItems.map((item, index) => (
        <React.Fragment key={getItemKey(item, filteredItems[Math.max(0, index - 1)])}>
          <Divider isShown={!isDesktop && index !== 0} />
          {isAmityAd(item) ? (
            <PostAd ad={item} />
          ) : (
            <ClickableArea
              elementType="div"
              className={styles.global_feed__postContainer}
              onPress={() =>
                AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({ postId: item.postId })
              }
            >
              <PostContent
                pageId={pageId}
                post={item}
                category={AmityPostCategory.GENERAL}
                style={AmityPostContentComponentStyle.FEED}
                onClick={(context) => {
                  AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
                    postId: item?.postId,
                    commentId: context?.commentId,
                    parentId: context?.parentId,
                    selectedReplyComment: context?.selectedReplyComment,
                    showReplyCommentAt: context?.showReplyCommentAt,
                  });
                }}
                onPostDeleted={onPostDeleted}
                onPollPostDeleted={onPostDeleted}
              />
            </ClickableArea>
          )}
        </React.Fragment>
      ))}
      <Divider isShown={!isDesktop && filteredItems.length > 0} />
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <PostContentSkeleton />
              <Divider isShown={!isDesktop && index !== 5} />
            </div>
          ))
        : null}
      {!isLoading && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.global_feed__intersection}
        />
      )}
    </div>
  );
};
