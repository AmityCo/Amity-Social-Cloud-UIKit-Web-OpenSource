import { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import CreateCommunityRowItem from '~/v4/social/internal-components/CreateCommunityRowItem';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './MyCommunities.module.css';

type MyCommunitiesProps = {
  pageId?: string;
};

/**
 * The communities you already belong to.
 *
 * The rows are drawn here rather than by CommunitySearchResult, which is a
 * different component: it shows search results and answers to
 * `community_search_result`, which discovery owns. Borrowing it put the
 * membership list — community's — behind discovery's id, so switching Discovery
 * off emptied the list while its wrapper stayed. Every component was asking its
 * own id correctly; one id serving two owners is not something the resolver can
 * see.
 *
 * Android and iOS are shaped this way already: both nest the row inside the
 * `my_communities` component and keep `community_search_result` under
 * `social_global_search_page` only. Their config files carry
 * `social_home_page/my_communities/community_display_name` and no
 * `social_home_page/community_search_result/...` key at all.
 */
export const MyCommunities = ({ pageId = '*' }: MyCommunitiesProps) => {
  const componentId = 'my_communities';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();
  const { goToCommunityProfilePage, goToCommunitiesByCategoryPage } = useNavigation();

  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member', sortBy: 'displayName' },
  });

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && isLoading === false) loadMore();
    },
  });

  // Owned by a module and never asked. The component kept rendering
  // after its module was switched off.
  if (isExcluded) return null;

  return (
    <div style={themeStyles} className={styles.myCommunitiesList} data-testid={accessibilityId}>
      <CreateCommunityRowItem />
      <div className={styles.myCommunitiesList__items}>
        {communities.map((community) => (
          <CommunityRowItem
            pageId={pageId}
            componentId={componentId}
            community={community}
            key={community.communityId}
            maxCategoryCharacters={24}
            maxCategoriesLength={isDesktop ? 2 : 5}
            onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
            onClick={(communityId) => goToCommunityProfilePage(communityId)}
          />
        ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CommunityRowItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
    </div>
  );
};
