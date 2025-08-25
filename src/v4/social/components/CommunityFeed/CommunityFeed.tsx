import React, { useEffect, useState, useRef } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostContent } from '~/v4/social/components/PostContent';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import EmptyPost from '~/v4/icons/EmptyPost';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { Button } from '~/v4/core/natives/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import usePinnedPostsCollection from '~/v4/social/hooks/collections/usePinnedPostCollection';
import { Typography } from '~/v4/core/components';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { useFeedScrollContext } from '~/v4/core/providers/FeedScrollProvider';
import styles from './CommunityFeed.module.css';

export const CommunityFeedPostContentSkeleton = () => {
  return (
    <div className={styles.communityFeed__postSkeleton}>
      <div className={styles.communityFeed__postSkeletonHeader}>
        <div className={styles.communityFeed__postSkeletonAvatar}></div>
        <div className={styles.communityFeed__postSkeletonUserInfo}>
          <div className={styles.communityFeed__postSkeletonUsername}></div>
          <div className={styles.communityFeed__postSkeletonSubtitle}></div>
        </div>
      </div>
      <div className={styles.communityFeed__postSkeletonContent}>
        <div className={styles.communityFeed__postSkeletonLine}></div>
        <div className={styles.communityFeed__postSkeletonLine}></div>
        <div className={styles.communityFeed__postSkeletonLine}></div>
      </div>
    </div>
  );
};

interface CommunityFeedProps {
  communityId: string;
  pageId?: string;
}

export const CommunityFeed = ({ pageId = '*', communityId }: CommunityFeedProps) => {
  const componentId = 'community_feed_component';
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { scrollPosition } = useFeedScrollContext();
  const hasRestoredScroll = useRef(false);

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });

  const {
    posts,
    hasMore,
    loadMore,
    isLoading,
    refresh: refreshPosts,
  } = usePostsCollection({
    feedType: 'published',
    targetId: communityId,
    targetType: 'community',
    limit: 10,
  });

  const { pinnedPost: allPinnedPost, refresh: refreshPinnedPosts } = usePinnedPostsCollection({
    communityId,
    shouldCall: !!communityId && community?.isJoined,
  });

  const { AmityCommunityProfilePageBehavior } = usePageBehavior();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const announcementPosts =
    allPinnedPost?.filter((item) => item?.placement === 'announcement' && item?.post) || [];

  const pinnedPosts =
    allPinnedPost.length > 0
      ? allPinnedPost.filter(
          (item) =>
            item?.placement === 'default' &&
            item?.post &&
            !announcementPosts.map((aItem) => aItem?.post?.postId).includes(item?.post?.postId),
        )
      : null;

  const isAnnouncePostWasPinned = allPinnedPost?.some(
    (item) =>
      item?.placement === 'default' &&
      item?.post &&
      announcementPosts.map((aItem) => aItem?.post?.postId).includes(item?.post?.postId),
  );

  const filteredPosts = posts.filter(
    (post) =>
      post &&
      !announcementPosts.some(
        (announcementPost) => announcementPost?.post?.postId === post?.postId,
      ),
  );

  const filteredPostWithPlacement: (Amity.Post & { placement?: string })[] = filteredPosts.map(
    (post) => {
      const matchedPinnedPost = pinnedPosts?.find(
        (pinned) => pinned?.post?.postId === post?.postId,
      );
      if (matchedPinnedPost)
        return {
          ...post,
          placement: matchedPinnedPost.placement,
        };
      return post;
    },
  );

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  useEffect(() => {
    refreshPosts();
    refreshPinnedPosts();
  }, []);

  // Scroll restoration effect - runs when posts are loaded
  useEffect(() => {
    // Only restore scroll when we have posts and content is loaded
    if (scrollPosition > 0 && posts.length > 0 && !isLoading && !hasRestoredScroll.current) {
      const scrollContainer = document.getElementById('community_profile_page/*/*');

      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollPosition,
          behavior: 'auto',
        });
        hasRestoredScroll.current = true;
      }
    }
  }, [posts, isLoading, scrollPosition, pageId]);

  // Reset scroll restoration flag when community changes
  useEffect(() => {
    hasRestoredScroll.current = false;
  }, [communityId]);

  if (isExcluded) return null;

  const handlePostNavigation = (postId?: string, category?: AmityPostCategory) => {
    if (!postId) return;

    AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
      postId,
      hideTarget: true,
      category: category || AmityPostCategory.GENERAL,
    });
  };

  const renderPublicCommunityFeed = () => {
    return (
      <>
        {filteredPostWithPlacement.length > 0 &&
          filteredPostWithPlacement
            .filter((post) => post && !!post.postId)
            .map((post) => {
              if (!post || !post.postId) return null;

              const category =
                post?.placement === 'default' ? AmityPostCategory.PIN : AmityPostCategory.GENERAL;

              return (
                <Button
                  key={post.postId}
                  className={styles.communityFeed__postContent}
                  onPress={() => handlePostNavigation(post.postId, category)}
                >
                  <PostContent
                    pageId={pageId}
                    key={post.postId}
                    post={post}
                    category={category}
                    style={AmityPostContentComponentStyle.FEED}
                    hideTarget
                    onClick={() => handlePostNavigation(post.postId, category)}
                  />
                </Button>
              );
            })}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <CommunityFeedPostContentSkeleton key={index} />
          ))}
        {posts?.length === 0 && !isLoading && (
          <div className={styles.communityFeed__emptyPost}>
            <EmptyPost className={styles.communityFeed__emptyPostIcon} />
            <Typography.Body className={styles.communityFeed__emptyPostText}>
              No posts yet
            </Typography.Body>
          </div>
        )}
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.communityFeed__observerTarget}
        />
      </>
    );
  };

  const renderAnnouncementPost = () => {
    return announcementPosts.length > 0
      ? announcementPosts
          .filter(({ post }) => !!post && !!post.postId)
          .map(({ post }) => {
            if (!post || !post.postId) return null;

            const category = isAnnouncePostWasPinned
              ? AmityPostCategory.PIN_AND_ANNOUNCEMENT
              : AmityPostCategory.ANNOUNCEMENT;

            return (
              <Button
                key={post.postId}
                onPress={() => handlePostNavigation(post.postId, category)}
                className={styles.communityFeed__announcePost}
              >
                <PostContent
                  pageId={pageId}
                  key={post.postId}
                  post={post}
                  category={category}
                  style={AmityPostContentComponentStyle.FEED}
                  hideTarget
                  onClick={() => handlePostNavigation(post.postId, category)}
                  onPostDeleted={() => refreshPinnedPosts()}
                />
              </Button>
            );
          })
      : null;
  };

  return (
    <div
      data-testid={accessibilityId}
      className={styles.communityFeed__container}
      style={themeStyles}
    >
      <NoInternetConnectionHoc
        page="feed"
        refresh={() => {
          refreshPosts();
          refreshPinnedPosts();
        }}
        className={styles.communityFeed__noInternet}
      >
        <>
          {community?.isJoined || community?.isPublic ? (
            <>
              {renderAnnouncementPost()}
              {renderPublicCommunityFeed()}
            </>
          ) : isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <CommunityFeedPostContentSkeleton key={index} />
            ))
          ) : (
            <LockPrivateContent />
          )}
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
