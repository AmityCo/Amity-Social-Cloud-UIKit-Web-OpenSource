import React, { useEffect } from 'react';
import { JoinRequestStatusEnum } from '@amityco/ts-sdk';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './TrendingCommunities.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useGetJoinRequestList } from '~/v4/social/hooks/useGetJoinRequestList';

type TrendingCommunitiesProps = {
  pageId?: string;
};

export const TrendingCommunities = ({ pageId = '*' }: TrendingCommunitiesProps) => {
  const componentId = 'trending_communities';

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { trendingCommunities, isLoading, fetchTrendingCommunities, pendingJoinCommunities } =
    useExplore();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const communityIds = trendingCommunities.map((community) => community.communityId);

  const { joinRequestList } = useGetJoinRequestList(communityIds);

  useEffect(() => {
    fetchTrendingCommunities();
  }, []);

  if (isLoading) {
    return (
      <div style={themeStyles} data-testid={accessibilityId} className={styles.trendingCommunities}>
        {Array.from({ length: 5 }).map((_, index) => (
          <CommunityRowItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (trendingCommunities.length === 0) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.trendingCommunities}>
      {trendingCommunities.map((community, index) => {
        const joinRequest = joinRequestList?.find(
          (request) => request.targetId === community.communityId,
        );

        // Check if this community is in pending join state from shared context
        const isPendingJoin = pendingJoinCommunities.includes(community.communityId);

        // Update status to pending for existing join requests in pending communities
        let pendingJoinRequest = joinRequest;
        if (isPendingJoin && joinRequest) {
          pendingJoinRequest = { ...joinRequest, status: JoinRequestStatusEnum.Pending };
        }

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
          />
        );
      })}
    </div>
  );
};
