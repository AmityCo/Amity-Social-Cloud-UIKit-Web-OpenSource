import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useNavigation, PageTypes } from '~/v4/core/providers/NavigationProvider';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import {
  MyCommunitiesSideBarItem,
  MyCommunitiesSideBarItemSkeleton,
} from '~/v4/social/internal-components/MyCommunitiesSideBarItem';
import styles from './MyCommunitiesSideBar.module.css';

type MyCommunitiesSideBarProps = {
  pageId?: string;
};

export const MyCommunitiesSideBar = ({ pageId = '*' }: MyCommunitiesSideBarProps) => {
  const componentId = 'my_communities';

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { goToCommunityProfilePage, goToCommunitiesByCategoryPage, page } = useNavigation();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  return (
    <div style={themeStyles} className={styles.myCommunitiesList} data-testid={accessibilityId}>
      {communities.map((community) => (
        <MyCommunitiesSideBarItem
          pageId={pageId}
          community={community}
          maxCategoriesLength={2}
          componentId={componentId}
          key={community.communityId}
          isSelected={
            page.type === PageTypes.CommunityProfilePage &&
            selectedCommunityId === community.communityId
          }
          onCategoryClick={(categoryId) => {
            goToCommunitiesByCategoryPage({ categoryId });
          }}
          onClick={(communityId) => {
            setSelectedCommunityId(communityId);
            goToCommunityProfilePage(communityId);
          }}
        />
      ))}
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <MyCommunitiesSideBarItemSkeleton
              key={index}
              pageId={pageId}
              componentId={componentId}
            />
          ))
        : null}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
