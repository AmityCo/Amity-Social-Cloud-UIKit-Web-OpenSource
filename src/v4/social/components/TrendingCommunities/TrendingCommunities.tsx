import React, { useEffect } from 'react';

import styles from './TrendingCommunities.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { CommunityRowItemDivider } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemDivider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';

interface TrendingCommunitiesProps {
  pageId?: string;
}

export const TrendingCommunities = ({ pageId = '*' }: TrendingCommunitiesProps) => {
  const componentId = 'trending_communities';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { trendingCommunities, isLoading, fetchTrendingCommunities } = useExplore();

  useEffect(() => {
    fetchTrendingCommunities();
  }, []);

  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const { joinCommunity, leaveCommunity } = useCommunityActions();

  const handleJoinButtonClick = (communityId: string) => joinCommunity(communityId);
  const handleLeaveButtonClick = (communityId: string) => leaveCommunity(communityId);

  if (isLoading) {
    return (
      <div
        style={themeStyles}
        data-qa-anchor={accessibilityId}
        className={styles.trendingCommunities}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>
            <CommunityRowItemDivider />
            <CommunityRowItemSkeleton />
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (trendingCommunities.length === 0) {
    return null;
  }

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.trendingCommunities}
    >
      {trendingCommunities.map((community, index) => (
        <React.Fragment key={community.communityId}>
          <CommunityRowItemDivider />
          <CommunityRowItem
            community={community}
            pageId={pageId}
            componentId={componentId}
            order={index + 1}
            onClick={(communityId) => goToCommunityProfilePage(communityId)}
            onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
            onJoinButtonClick={handleJoinButtonClick}
            onLeaveButtonClick={handleLeaveButtonClick}
            showJoinButton
            minCategoryCharacters={3}
            maxCategoryCharacters={36}
            maxCategoriesLength={2}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
