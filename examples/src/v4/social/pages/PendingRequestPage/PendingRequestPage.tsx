import React, { useEffect, useState } from 'react';
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
    hasMore: hasMoreJoinRequests,
    loadMore: loadMoreJoinRequests,
    loading: isJoinRequestsLoading,
  } = useJoinRequestsCollection({ community });

  const defaultActiveTab = [
    canReviewCommunityPosts ? 'posts_button_tab' : null,
    joinRequests?.length ? 'join_requests_button_tab' : null,
  ].filter(Boolean) as Key[];

  const [activeTab, setActiveTab] = useState<Key>(defaultActiveTab[0] || 'posts_button_tab');
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
    if (joinRequestsCount > 0 && reviewingPosts.length === 0) {
      setActiveTab('join_requests_button_tab');
    } else {
      setActiveTab('posts_button_tab');
    }
  }, [reviewingPosts.length, joinRequestsCount]);

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
          <JoinRequestContent
            pageId={pageId}
            joinRequests={joinRequests}
            isLoading={isJoinRequestsLoading}
          />

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
          onChange={(key) => setActiveTab(key)}
          className={styles.pendingRequestsPage__secondaryTab}
          tabListClassName={styles.pendingRequestsPage__tabList}
        />
      </div>
    </div>
  );
};
