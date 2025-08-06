import React, { useEffect, useState, useRef } from 'react';
import { Key } from 'react-aria';
import { useAmityElement, useAmityPage } from '~/v4/core/hooks/uikit';
import styles from './PendingRequestPage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { BackButton, Title } from '~/v4/social/elements';
import { SecondaryTab } from '~/v4/core/components/SecondaryTab';
import { JoinRequestContent } from '~/v4/social/components/JoinRequestContent';
import { PendingPostList } from '~/v4/social/components/PendingPostList';
import { useCommunityInfo } from '~/v4/social/hooks';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useJoinRequestsCollection from '~/v4/social/hooks/collections/useJoinRequestsCollection';
import { UserListSkeleton } from '~/v4/core/components/UserListSkeleton';

type PendingRequestPageProps = {
  community: Amity.Community;
};

export const PendingRequestPage = ({ community }: PendingRequestPageProps) => {
  const pageId = 'pending_request_page';
  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({
    pageId,
  });

  const { onBack } = useNavigation();
  const { currentUserId } = useSDK();
  const { canReviewCommunityPosts } = useCommunityInfo(community.communityId);

  const {
    joinRequests,
    refresh: refreshJoinRequests,
    hasMore: hasMoreJoinRequests,
    loadMore: loadMoreJoinRequests,
    loading: isJoinRequestsLoading,
  } = useJoinRequestsCollection({ community });

  // Determine initial active tab - prioritize posts tab when user can review posts
  const getInitialActiveTab = () => {
    // If user can review posts, start with posts tab
    if (canReviewCommunityPosts) {
      return 'posts_button_tab';
    }
    // Otherwise, check if there are join requests to show
    if (joinRequests?.length) {
      return 'join_requests_button_tab';
    }
    // Default fallback
    return 'posts_button_tab';
  };

  const [activeTab, setActiveTab] = useState<Key>(getInitialActiveTab());
  const isManualTabChangeRef = useRef<boolean>(false);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [intersectionNodePost, setIntersectionNodePost] = useState<HTMLDivElement | null>(null);

  const postsTab = useAmityElement({
    pageId,
    componentId: '*',
    elementId: 'posts_button_tab',
  });
  const joinRequestsTab = useAmityElement({
    pageId,
    componentId: '*',
    elementId: 'join_requests_button_tab',
  });

  if (isExcluded) return null;

  const {
    posts: reviewingPosts,
    isLoading,
    refresh,
    loadMore: loadMorePosts,
    hasMore: hasMorePosts,
  } = usePostsCollection({
    targetType: 'community',
    targetId: community.communityId,
    feedType: 'reviewing',
  });

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);
  const joinRequestsCount = (joinRequests && joinRequests?.length) || 0;

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMoreJoinRequests && isJoinRequestsLoading === false) {
        loadMoreJoinRequests();
      }
    },
    node: intersectionNode,
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMorePosts && !isLoading) {
        loadMorePosts();
      }
    },
    node: intersectionNodePost,
  });

  useEffect(() => {
    // Only auto-switch if it's not a manual tab change
    if (isManualTabChangeRef.current) {
      isManualTabChangeRef.current = false; // Reset the flag
      return;
    }

    // Auto-switch logic based on current active tab and counts
    if (activeTab === 'posts_button_tab') {
      // If currently on posts tab, only switch to join requests tab when:
      // - No reviewing posts left AND there are join requests to show
      if (reviewingPosts.length === 0 && joinRequestsCount > 0) {
        setActiveTab('join_requests_button_tab');
      }
    } else if (activeTab === 'join_requests_button_tab') {
      // If currently on join requests tab, only switch to posts tab when:
      // - No join requests left AND there are reviewing posts to show
      if (joinRequestsCount === 0 && reviewingPosts.length > 0) {
        setActiveTab('posts_button_tab');
      }
    }
  }, [reviewingPosts.length, joinRequestsCount, activeTab]);

  const renderAmouts = (count: number) => {
    return count > 10 ? '10+' : count;
  };

  const visibleTabs = [];

  // Only add the posts tab if the user has permission to review posts
  if (
    (community.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED ||
      (community as Amity.Community & { needApprovalOnPostCreation?: boolean })
        .needApprovalOnPostCreation) &&
    (canReviewCommunityPosts || isPostOwner)
  ) {
    visibleTabs.push({
      value: 'posts_button_tab',
      label: `${postsTab?.config?.text} (${renderAmouts(reviewingPosts.length)})`,
      accessibilityId: `${pageId}}/*/posts_button_tab`,
      content: () => (
        <>
          <div className={styles.pendingPostsPage__list}>
            <PendingPostList
              reviewingPosts={reviewingPosts}
              pageId={pageId}
              canReviewCommunityPosts={canReviewCommunityPosts}
              refresh={refresh}
            />
          </div>
          {isLoading && reviewingPosts && reviewingPosts.length > 0 && (
            <div className={styles.pendingRequestsPage__skeletonContainer}>
              {Array.from({ length: 3 }).map((_, index) => (
                <UserListSkeleton key={`loading-more-posts-${index}`} />
              ))}
            </div>
          )}
          <div ref={(node) => setIntersectionNodePost(node)} />
        </>
      ),
    });
  }

  // Only add the join requests tab if the user has permission to review community posts
  if (community.requiresJoinApproval && canReviewCommunityPosts) {
    visibleTabs.push({
      value: 'join_requests_button_tab',
      label: `${joinRequestsTab?.config?.text} (${renderAmouts(joinRequestsCount)})`,
      accessibilityId: `${pageId}/*/join_requests_button_tab`,
      content: () => (
        <>
          {!isJoinRequestsLoading && (
            <JoinRequestContent
              pageId={pageId}
              joinRequests={joinRequests}
              isLoading={isJoinRequestsLoading}
              refresh={() => refreshJoinRequests()}
            />
          )}

          {isJoinRequestsLoading && joinRequests && joinRequests.length > 0 && (
            <div className={styles.pendingRequestsPage__skeletonContainer}>
              {Array.from({ length: 3 }).map((_, index) => (
                <UserListSkeleton key={`loading-more-${index}`} />
              ))}
            </div>
          )}
          <div ref={(node) => setIntersectionNode(node)} />
        </>
      ),
    });
  }

  const tabs = visibleTabs;

  // If no tabs are visible, don't render anything
  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.pendingRequestsPage__container}
      style={themeStyles}
      data-amity-accessibility-id={accessibilityId}
    >
      <div className={styles.pendingRequestsPage__topBar}>
        <BackButton pageId={pageId} onPress={() => onBack()} />
        <div className={styles.pendingRequestsPage__titleWrap}>
          <Title pageId={pageId} titleClassName={styles.pendingRequestsPage__title} />
        </div>
        <div className={styles.pendingRequestsPage__emptyDiv} />
      </div>
      <div className={styles.pendingRequestsPage__content}>
        <SecondaryTab
          tabs={tabs}
          activeTab={activeTab}
          onChange={(key) => {
            // Mark as manual change using ref for immediate effect
            isManualTabChangeRef.current = true;
            setActiveTab(key);
          }}
          className={styles.pendingRequestsPage__secondaryTab}
          tabListClassName={styles.pendingRequestsPage__tabList}
        />
      </div>
    </div>
  );
};
