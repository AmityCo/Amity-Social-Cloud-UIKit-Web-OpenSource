import React, { useState } from 'react';
import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useCategory } from '~/v4/core/hooks/useCategory';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CategoryTitle } from '~/v4/social/elements/CategoryTitle';
import { BackButton } from '~/v4/social/elements/BackButton';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import { EmptyCommunity } from './EmptyCommunity';
import { CommunityRowItemDivider } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemDivider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import styles from './CommunitiesByCategoryPage.module.css';

interface CommunitiesByCategoryPageProps {
  categoryId: string;
}

export function CommunitiesByCategoryPage({ categoryId }: CommunitiesByCategoryPageProps) {
  const pageId = 'communities_by_category_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { onBack, goToCommunityProfilePage, goToCommunitiesByCategoryPage } = useNavigation();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { communities, isLoading, loadMore, hasMore } = useCommunitiesCollection({
    categoryId,
    limit: 20,
  });

  const category = useCategory({ categoryId });

  const { joinCommunity, leaveCommunity } = useCommunityActions();

  const handleJoinButtonClick = (communityId: string) => joinCommunity(communityId);
  const handleLeaveButtonClick = (communityId: string) => leaveCommunity(communityId);

  useIntersectionObserver({
    onIntersect: () => {
      if (isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  const isEmpty = communities.length === 0 && !isLoading;

  return (
    <div
      className={styles.communitiesByCategoryPage}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      <div className={styles.communitiesByCategoryPage__navigation}>
        <div className={styles.communitiesByCategoryPage__navigationBackButton}>
          <BackButton pageId={pageId} onPress={onBack} />
        </div>
        <div className={styles.communitiesByCategoryPage__navigationTitle}>
          <CategoryTitle pageId={pageId} categoryName={category?.name || ''} />
        </div>
      </div>
      {isEmpty ? (
        <EmptyCommunity pageId={pageId} />
      ) : (
        <div>
          {communities.map((community, index) => (
            <React.Fragment key={community.communityId}>
              <CommunityRowItemDivider />
              <CommunityRowItem
                community={community}
                pageId={pageId}
                onClick={(communityId) => goToCommunityProfilePage(communityId)}
                onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
                onJoinButtonClick={handleJoinButtonClick}
                onLeaveButtonClick={handleLeaveButtonClick}
                showJoinButton
                minCategoryCharacters={4}
                maxCategoryCharacters={30}
                maxCategoriesLength={2}
              />
            </React.Fragment>
          ))}
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <React.Fragment key={index}>
                <CommunityRowItemDivider />
                <CommunityRowItemSkeleton />
              </React.Fragment>
            ))}
          {hasMore && (
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.communitiesByCategoryPage__intersectionNode}
            />
          )}
        </div>
      )}
    </div>
  );
}
