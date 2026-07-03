import React, { useEffect } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { EmptyPinnedPost } from '~/v4/social/components/EmptyPinnedPost';
import styles from './CommunityPin.module.css';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import usePinnedPostsCollection from '~/v4/social/hooks/collections/usePinnedPostCollection';
import { CommunityFeedPostContentSkeleton } from '~/v4/social/components/CommunityFeed/CommunityFeed';
import { Button } from '~/v4/core/natives/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
  PostContent,
} from '~/v4/social/components/PostContent/PostContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

interface CommunityPinProps {
  pageId?: string;
  communityId: string;
}

export const CommunityPin = ({ pageId = '*', communityId }: CommunityPinProps) => {
  const componentId = 'community_pin';
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  if (isExcluded) return null;

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { pinnedPost, isLoading, refresh } = usePinnedPostsCollection({
    communityId,
    shouldCall: !!communityId && (community?.isJoined || community?.isPublic),
  });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  useEffect(() => {
    refresh();
  }, []);

  const announcementPosts = pinnedPost.filter(
    (post) =>
      post.placement === 'announcement' &&
      pinnedPost.some(
        (pinned) => pinned.placement === 'default' && pinned.referenceId === post.referenceId,
      ),
  );
  const pinnedPostsWithFilterOutAnnouncePost = pinnedPost
    .filter((post) => post.placement === 'default')
    .filter(
      (post) =>
        !announcementPosts.some((announcement) => announcement.referenceId === post.referenceId),
    );

  const pinnedPosts = pinnedPost.filter((post) => post.placement === 'default');

  const handlePostDeleted = () => {
    refresh();
  };

  const renderAnnouncementPost = () => {
    return isLoading ? (
      <CommunityFeedPostContentSkeleton />
    ) : (
      announcementPosts &&
        announcementPosts.map(({ post }: Amity.PinnedPost) => {
          if (!post || !post.postId) return null;

          return (
            <Button
              key={post.postId}
              onPress={() => {
                AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                  postId: post.postId,
                  hideTarget: true,
                  category: AmityPostCategory.PIN_AND_ANNOUNCEMENT,
                });
              }}
              className={styles.communityPin__feed}
            >
              <PostContent
                key={post.postId}
                post={post}
                category={AmityPostCategory.PIN_AND_ANNOUNCEMENT}
                style={AmityPostContentComponentStyle.FEED}
                hideTarget
                onClick={() =>
                  AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                    postId: post.postId,
                    hideTarget: true,
                    category: AmityPostCategory.PIN_AND_ANNOUNCEMENT,
                  })
                }
                onPostDeleted={handlePostDeleted}
                onPollPostDeleted={handlePostDeleted}
              />
            </Button>
          );
        })
    );
  };

  const renderPinnedPost = () => {
    const pinnedPostsFilter =
      announcementPosts.length > 0 ? pinnedPostsWithFilterOutAnnouncePost : pinnedPosts;

    return (
      <>
        {!isLoading &&
          pinnedPostsFilter.map(({ post }: Amity.PinnedPost) => {
            if (!post || !post.postId) return null;

            return (
              <Button
                key={post.postId}
                onPress={() => {
                  AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                    postId: post.postId,
                    hideTarget: true,
                    category: AmityPostCategory.PIN,
                  });
                }}
                className={styles.communityPin__feed}
              >
                <PostContent
                  key={post.postId}
                  post={post}
                  category={AmityPostCategory.PIN}
                  style={AmityPostContentComponentStyle.FEED}
                  hideTarget
                  onClick={() =>
                    AmityCommunityProfilePageBehavior?.goToPostDetailPage?.({
                      postId: post.postId,
                      hideTarget: true,
                      category: AmityPostCategory.PIN,
                    })
                  }
                  onPostDeleted={handlePostDeleted}
                  onPollPostDeleted={handlePostDeleted}
                />
              </Button>
            );
          })}
        {isLoading && <CommunityFeedPostContentSkeleton />}
      </>
    );
  };

  return (
    <div
      data-testid={accessibilityId}
      className={styles.communityPin__container}
      style={themeStyles}
    >
      <NoInternetConnectionHoc
        page="feed"
        refresh={refresh}
        className={styles.communityPin__noInternet}
      >
        {isMemberPrivateCommunity || community?.isPublic ? (
          pinnedPost.length > 0 ? (
            <>
              {renderAnnouncementPost()}
              {renderPinnedPost()}
            </>
          ) : (
            <EmptyPinnedPost />
          )
        ) : (
          <LockPrivateContent />
        )}
      </NoInternetConnectionHoc>
    </div>
  );
};
