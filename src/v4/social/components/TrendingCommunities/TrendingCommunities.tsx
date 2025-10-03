import React, { useEffect } from 'react';
import { JoinRequestStatusEnum, JoinResultStatusEnum } from '@amityco/ts-sdk';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './TrendingCommunities.module.css';
import { useGetJoinRequestList } from '~/v4/social/hooks/useGetJoinRequestList';
import useSDK from '~/v4/core/hooks/useSDK';

type TrendingCommunitiesProps = {
  pageId?: string;
};

export const TrendingCommunities = ({ pageId = '*' }: TrendingCommunitiesProps) => {
  const componentId = 'trending_communities';
  const { isVisitorOrBot } = useSDK();

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const MAX_COMMUNITIES = 5; // Limit to 5 communities
  const {
    trendingCommunities,
    isLoading,
    fetchTrendingCommunities,
    pendingJoinCommunities,
    refreshBothCommunityCollections,
    setPendingJoinCommunity,
    removePendingJoinCommunity,
  } = useExplore();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const communityIds = trendingCommunities.map((community) => community.communityId);

  const { joinRequestList } = useGetJoinRequestList({ communityIds, enabled: !isVisitorOrBot });

  useEffect(() => {
    fetchTrendingCommunities();
  }, []);

  if (isLoading) {
    return (
      <div
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.trendingCommunities}
        role="region"
        aria-label="Loading trending communities"
        aria-busy="true"
      >
        {Array.from({ length: MAX_COMMUNITIES }).map((_, index) => (
          <CommunityRowItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (trendingCommunities.length === 0) {
    return null;
  }

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.trendingCommunities}>
      {trendingCommunities.slice(0, MAX_COMMUNITIES).map((community, index) => {
        const joinRequest = joinRequestList?.find(
          (request) => request.targetId === community.communityId,
        );

        // Check if this community is in pending join state from shared context
        const isPendingJoin = pendingJoinCommunities.includes(community.communityId);

        // Update status to pending for existing join requests in pending communities
        let pendingJoinRequest = joinRequest;
        if (isPendingJoin && joinRequest) {
          pendingJoinRequest = { ...joinRequest, status: JoinRequestStatusEnum.Pending };
        } else if (isPendingJoin && !joinRequest) {
          // Create a mock pending join request if community is in pending state but no join request exists
          pendingJoinRequest = {
            status: JoinRequestStatusEnum.Pending,
            targetId: community.communityId,
          } as Amity.JoinRequest;
        }

        const handleJoinSuccess = (community: Amity.Community, data?: Amity.JoinResult) => {
          if (data?.status === JoinResultStatusEnum.Pending) {
            setPendingJoinCommunity(community.communityId);
          }
          refreshBothCommunityCollections();
        };

        const handleLeaveSuccess = (community: Amity.Community) => {
          // Remove from pending list if it was there
          removePendingJoinCommunity(community.communityId);
          refreshBothCommunityCollections();
        };

        const handlePendingButtonClick = () => {
          removePendingJoinCommunity(community.communityId);
          refreshBothCommunityCollections();
        };

        return (
          <CommunityRowItem
            showJoinButton
            pageId={pageId}
            order={index + 1}
            community={community}
            maxCategoriesLength={2}
            minCategoryCharacters={3}
            componentId={componentId}
            maxCategoryCharacters={36}
            key={community.communityId}
            onClick={(communityId) => goToCommunityProfilePage(communityId)}
            onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
            joinRequest={pendingJoinRequest}
            onJoinSuccess={(community, data) => handleJoinSuccess(community, data)}
            onLeaveSuccess={(community) => handleLeaveSuccess(community)}
            onPendingButtonClick={() => handlePendingButtonClick()}
          />
        );
      })}
    </div>
  );
};
