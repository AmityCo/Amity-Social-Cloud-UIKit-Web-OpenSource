import React, { useEffect } from 'react';
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

  const { joinCommunity, leaveCommunity, cancelJoinCommunity } = useCommunityActions();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { trendingCommunities, isLoading, fetchTrendingCommunities } = useExplore();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();
  const { confirm } = useConfirmContext();

  const communityIds = trendingCommunities.map((community) => community.communityId);

  const { joinRequestList } = useGetJoinRequestList(communityIds);

  const handleJoinButtonClick = (community: Amity.Community) => joinCommunity(community);
  const handleLeaveButtonClick = (community: Amity.Community) => {
    if (community.requiresJoinApproval) {
      confirm({
        title: 'Leave Community',
        content: 'If you change your mind, you’ll have to request to join again.',
        onOk: () => leaveCommunity(community),
      });
      return;
    }
    leaveCommunity(community);
  };
  const handlePendingButtonClick = () => cancelJoinCommunity();

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
      {trendingCommunities.map((community, index) => (
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
          onJoinButtonClick={(community) => handleJoinButtonClick(community)}
          onLeaveButtonClick={(community) => handleLeaveButtonClick(community)}
          onPendingButtonClick={handlePendingButtonClick}
          onClick={(communityId) => goToCommunityProfilePage(communityId)}
          onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
          joinRequest={
            joinRequestList &&
            joinRequestList?.find((request) => request.targetId === community.communityId)
          }
        />
      ))}
    </div>
  );
};
