import React, { useState } from 'react';
import styles from './CommunitySearchResult.module.css';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityRowItemDivider } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemDivider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';

interface CommunitySearchResultProps {
  pageId?: string;
  communityCollection: Amity.Community[];
  isLoading: boolean;
  showJoinButton?: boolean;
  onLoadMore: () => void;
}

export const CommunitySearchResult = ({
  pageId = '*',
  communityCollection = [],
  isLoading,
  onLoadMore,
  showJoinButton = false,
}: CommunitySearchResultProps) => {
  const componentId = 'community_search_result';
  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { goToCommunityProfilePage, goToCommunitiesByCategoryPage } = useNavigation();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  const { joinCommunity, leaveCommunity } = useCommunityActions();

  return (
    <div
      className={styles.communitySearchResult}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {communityCollection.map((community) => (
        <React.Fragment key={community.communityId}>
          <CommunityRowItemDivider />
          <CommunityRowItem
            community={community}
            pageId={pageId}
            componentId={componentId}
            onClick={(communityId) => goToCommunityProfilePage(communityId)}
            onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
            onJoinButtonClick={(communityId) => joinCommunity(communityId)}
            onLeaveButtonClick={(communityId) => leaveCommunity(communityId)}
            showJoinButton={showJoinButton}
            maxCategoriesLength={5}
          />
        </React.Fragment>
      ))}
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <React.Fragment key={index}>
              <CommunityRowItemDivider />
              <CommunityRowItemSkeleton pageId={pageId} componentId={componentId} />
            </React.Fragment>
          ))
        : null}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
