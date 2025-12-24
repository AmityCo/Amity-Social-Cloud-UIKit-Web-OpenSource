import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { SearchLimit } from '~/v4/social/components/SearchLimit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './CommunitySearchResult.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';

type CommunitySearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  showJoinButton?: boolean;
  onClosePopover?: () => void;
  communityCollection: Amity.Community[];
};

export const CommunitySearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  showJoinButton = false,
  communityCollection = [],
}: CommunitySearchResultProps) => {
  const componentId = 'community_search_result';

  const { isDesktop } = useResponsive();
  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { goToCommunityProfilePage, goToCommunitiesByCategoryPage } = useNavigation();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.communitySearchResult}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.communitySearchResult__noInternetConnectionHoc}
      >
        {communityCollection.length > 0 &&
          communityCollection.map((community) => (
            <CommunityRowItem
              pageId={pageId}
              community={community}
              componentId={componentId}
              maxCategoryCharacters={24}
              key={community.communityId}
              showJoinButton={showJoinButton}
              maxCategoriesLength={isDesktop ? 2 : 5}
              onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
              onClick={(communityId) => {
                onClosePopover?.();
                goToCommunityProfilePage(communityId);
              }}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CommunityRowItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && communityCollection.length === 0 && <EmptySearchResult />}
        <div ref={(node) => setIntersectionNode(node)} />
      </NoInternetConnectionHoc>
    </div>
  );
};
