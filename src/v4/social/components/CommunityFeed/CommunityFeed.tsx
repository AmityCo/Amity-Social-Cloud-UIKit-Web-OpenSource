import React, { useEffect, useRef } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostContent } from '~/v4/social/components/PostContent';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import styles from './CommunityFeed.module.css';
import EmptyPost from '~/v4/icons/EmptyPost';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunitySubscription from '~/v4/core/hooks/subscriptions/useCommunitySubscription';
import { Button } from '~/v4/core/natives/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import usePinnedPostsCollection from '~/v4/social/hooks/collections/usePinnedPostCollection';

const CommunityFeedPostContentSkeleton = () => {
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

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  const { posts, hasMore, loadMore, isLoading } = usePostsCollection({
    feedType: 'published',
    targetId: communityId,
    targetType: 'community',
    limit: 10,
  });

  const {
    pinnedPost: announcementPosts,
    isLoading: isLoadingAnnouncementPosts,
    refresh,
  } = usePinnedPostsCollection({
    communityId,
    placement: 'announcement',
  });

  const { AmityCommunityProfilePageBehavior } = usePageBehavior();

  useCommunitySubscription({ communityId, level: SubscriptionLevels.POST });

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadMore]);

  useEffect(() => {
    refresh();
  }, []);

  if (isExcluded) return null;

  const renderPublicCommunityFeed = () => {
    //TODO : Change any type to be Amity.PinnedPost after SDK deploy to PROD
    const filteredPosts = posts.filter(
      (post) =>
        !announcementPosts.some(
          (announcementPost: any) => announcementPost.post.postId === post.postId,
        ),
    );

    return (
      <>
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <CommunityFeedPostContentSkeleton key={index} />
            ))
          : filteredPosts &&
            filteredPosts.map((post) => (
              <Button
                className={styles.communityFeed__postContent}
                onPress={() =>
                  AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                    postId: post.postId,
                    hideTarget: true,
                  })
                }
              >
                <PostContent
                  key={post.postId}
                  post={post}
                  category={AmityPostCategory.GENERAL}
                  style={AmityPostContentComponentStyle.FEED}
                  hideTarget
                  onClick={() =>
                    AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                      postId: post.postId,
                      hideTarget: true,
                    })
                  }
                />
              </Button>
            ))}
        {posts?.length === 0 && !isLoading && (
          <div className={styles.communityFeed__emptyPost}>
            <EmptyPost className={styles.communityFeed__emptyPostIcon} />
            <p className={styles.communityFeed__emptyPostText}>No post yet</p>
          </div>
        )}
        <div ref={observerTarget} className={styles.communityFeed__observerTarget} />
      </>
    );
  };

  const renderAnnouncementPost = () => {
    return isLoadingAnnouncementPosts ? (
      <CommunityFeedPostContentSkeleton />
    ) : (
      announcementPosts &&
        announcementPosts.map(({ post }: Amity.Post) => {
          return (
            <Button
              onPress={() => {
                AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                  postId: post.postId,
                  hideTarget: true,
                  category: AmityPostCategory.ANNOUNCEMENT,
                });
              }}
              className={styles.communityFeed__announcePost}
            >
              <PostContent
                key={post.postId}
                post={post}
                category={AmityPostCategory.ANNOUNCEMENT}
                style={AmityPostContentComponentStyle.FEED}
                hideTarget
                onClick={() =>
                  AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                    postId: post.postId,
                    hideTarget: true,
                  })
                }
                onPostDeleted={() => refresh()}
              />
            </Button>
          );
        })
    );
  };

  return (
    <div
      data-qa-anchor={accessibilityId}
      className={styles.communityFeed__container}
      style={themeStyles}
    >
      {isMemberPrivateCommunity || community?.isPublic ? (
        <>
          {renderAnnouncementPost()}
          {renderPublicCommunityFeed()}
        </>
      ) : (
        <LockPrivateContent />
      )}
    </div>
  );
};
