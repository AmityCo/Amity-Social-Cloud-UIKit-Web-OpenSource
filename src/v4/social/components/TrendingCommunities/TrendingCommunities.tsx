import React, { useEffect } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './TrendingCommunities.module.css';

type TrendingCommunitiesProps = {
  pageId?: string;
};

export const TrendingCommunities = ({ pageId = '*' }: TrendingCommunitiesProps) => {
  const componentId = 'trending_communities';

  const { joinCommunity, leaveCommunity } = useCommunityActions();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { trendingCommunities, isLoading, fetchTrendingCommunities } = useExplore();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const handleJoinButtonClick = (communityId: string) => joinCommunity(communityId);
  const handleLeaveButtonClick = (communityId: string) => leaveCommunity(communityId);

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
          onJoinButtonClick={handleJoinButtonClick}
          onLeaveButtonClick={handleLeaveButtonClick}
          onClick={(communityId) => goToCommunityProfilePage(communityId)}
          onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
        />
      ))}
    </div>
  );
};
