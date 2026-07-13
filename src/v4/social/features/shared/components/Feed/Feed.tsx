import React, { useMemo, useRef, useState } from 'react';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostAd } from '~/v4/social/internal-components/PostAd/PostAd';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import { Divider } from '~/v4/social/elements/Divider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useMeaningFullView } from '~/v4/social/hooks/useMeaningFullView';
import { useAds } from '~/v4/social/hooks/useAds';
import styles from './Feed.module.css';

type PostClickHandler = NonNullable<React.ComponentProps<typeof PostContent>['onClick']>;

type FeedProps = {
  pageId?: string;
  componentId?: string;
  posts: Array<Amity.Post>;
  newPosts?: Array<Amity.Post>;
  globalFeaturedPosts?: Array<Amity.PinnedPost>;
  isLoading: boolean;
  isLoadingFirstPage: boolean;
  hasMore: boolean;
  isGlobalFeaturedPostsLoading?: boolean;
  withAnalytics?: boolean;
  onFeedReachBottom: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
};

const isAmityAd = (item: Amity.Post | Amity.Ad): item is Amity.Ad => {
  return (item as Amity.Ad)?.adId !== undefined;
};

export function Feed({
  pageId = '*',
  componentId = '*',
  posts,
  newPosts = [],
  globalFeaturedPosts,
  isLoading,
  isLoadingFirstPage,
  hasMore,
  withAnalytics = false,
  onFeedReachBottom,
  onPostDeleted,
}: FeedProps) {
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { isDesktop } = useResponsive();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();

  const { itemWithAds } = useAds({ posts });

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => onFeedReachBottom(),
  });

  const featuredPostIds = useMemo(
    () => new Set((globalFeaturedPosts ?? []).map((item) => item.post?.postId).filter(Boolean)),
    [globalFeaturedPosts],
  );
  const newPostIds = useMemo(
    () => new Set(newPosts.filter(Boolean).map((p) => p.postId)),
    [newPosts],
  );

  const filteredItems = useMemo(
    () =>
      itemWithAds.filter((item) => {
        // Live collections can transiently yield undefined entries (a
        // referenced post id not yet resolved in cache). Drop them so we never
        // read `.postId` off undefined further down.
        if (!item) return false;
        if (isAmityAd(item)) return true;
        return !featuredPostIds.has(item.postId) && !newPostIds.has(item.postId);
      }),
    [itemWithAds, featuredPostIds, newPostIds],
  );

  const handlePostClick =
    (post: Amity.Post, isFeatured = false): PostClickHandler =>
    (context) => {
      AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
        hideTarget: isFeatured ? false : undefined,
        postId: post.postId,
        category: isFeatured ? AmityPostCategory.ANNOUNCEMENT : undefined,
        commentId: context?.commentId,
        parentId: context?.parentId,
        selectedReplyComment: context?.selectedReplyComment,
        showReplyCommentAt: context?.showReplyCommentAt,
        isFromCommentClick: context?.isFromCommentClick,
      });
    };

  return (
    <div className={styles.feed} style={themeStyles} data-testid={accessibilityId}>
      {globalFeaturedPosts?.map((item) =>
        item.post ? (
          <React.Fragment key={item.post.postId}>
            <div className={styles.feed__postContainer}>
              <PostContent
                pageId={pageId}
                post={item.post}
                category={AmityPostCategory.ANNOUNCEMENT}
                style={AmityPostContentComponentStyle.FEED}
                isGlobalFeaturePost
                onPostDeleted={() => onPostDeleted?.(item.post!)}
                onPollPostDeleted={onPostDeleted}
                onClick={handlePostClick(item.post, true)}
              />
            </div>
            <Divider />
          </React.Fragment>
        ) : null,
      )}

      {newPosts
        .filter((post) => !!post?.postId)
        .map((post, index) => (
          <React.Fragment key={post.postId}>
            <Divider isShown={index !== 0} />
            <Feed.Post
              pageId={pageId}
              post={post}
              renderIndex={index}
              withAnalytics={withAnalytics}
              onPostDeleted={onPostDeleted}
              onClick={handlePostClick(post)}
            />
          </React.Fragment>
        ))}

      {filteredItems.map((item, index) => (
        <React.Fragment key={isAmityAd(item) ? `ad-${item.adId}-${index}` : item.postId}>
          <Divider isShown={!(index === 0 && newPosts.length === 0)} />
          {isAmityAd(item) ? (
            <PostAd ad={item} />
          ) : (
            <Feed.Post
              pageId={pageId}
              post={item}
              renderIndex={newPosts.length + index}
              withAnalytics={withAnalytics}
              onPostDeleted={onPostDeleted}
              onClick={handlePostClick(item)}
            />
          )}
        </React.Fragment>
      ))}

      <Divider isShown={filteredItems.length > 0 || newPosts.length > 0} />

      {(isLoadingFirstPage || isLoading) &&
        Array.from({ length: 5 }).map((_, index) => (
          <div key={`skeleton-${index}`}>
            <PostContentSkeleton />
            <Divider isShown={index !== 4} />
          </div>
        ))}

      {!isLoadingFirstPage && !isLoading && hasMore && (
        <div ref={(node) => setIntersectionNode(node)} className={styles.feed__intersection} />
      )}
    </div>
  );
}

type FeedPostProps = {
  pageId: string;
  post: Amity.Post;
  renderIndex: number;
  withAnalytics: boolean;
  onPostDeleted?: (post: Amity.Post) => void;
  onClick: NonNullable<React.ComponentProps<typeof PostContent>['onClick']>;
};

function FeedPost({
  pageId,
  post,
  renderIndex,
  withAnalytics,
  onPostDeleted,
  onClick,
}: FeedPostProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const viewedRef = useRef(false);

  useIntersectionObserver({
    node: withAnalytics ? node : null,
    onIntersect: () => {
      if (viewedRef.current) return;
      viewedRef.current = true;
      post.analytics.markAsViewed();
    },
    options: { threshold: 0.01 },
  });

  useMeaningFullView({
    node: withAnalytics ? node : null,
    onMeaningfulView: () => post.analytics.markAsMeaningfullyViewed(renderIndex),
  });

  return (
    <div ref={setNode} className={styles.feed__postContainer}>
      <PostContent
        pageId={pageId}
        post={post}
        category={AmityPostCategory.GENERAL}
        style={AmityPostContentComponentStyle.FEED}
        onPostDeleted={onPostDeleted}
        onPollPostDeleted={onPostDeleted}
        onClick={onClick}
      />
    </div>
  );
}

Feed.Post = FeedPost;
