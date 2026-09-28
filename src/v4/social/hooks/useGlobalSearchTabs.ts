import { useAmityElement } from '~/v4/core/hooks/uikit';

export type GlobalSearchTab = 'posts' | 'communities' | 'users';

/**
 * Which global search tabs this build shows, in order.
 *
 * The row belonged to Discovery and drew all three tabs unconditionally, so a
 * customer without Community still got a Communities tab over an empty list —
 * and one without Post a Posts tab. Discovery survives Community off, because
 * Chat satisfies its any-requirement, so the row itself has to stay: only the
 * tabs whose module went may go.
 *
 * One id per tab, because these are the ids the module tables own: Post owns the
 * posts tab, Community the communities tab, and the users tab is base identity —
 * the one that survives every combination, which is why the bar is still worth
 * showing when it is the only one left.
 *
 * Sibling of `useCommunityProfileTabs` and `useSocialHomeTabs`. Read it inside
 * the page: outside the page wrapper the config is read once, before it has
 * loaded, and never again.
 */
export const useGlobalSearchTabs = (pageId: string, componentId = 'top_search_bar') => {
  const posts = useAmityElement({ pageId, componentId, elementId: 'search_posts_tab_button' });
  const communities = useAmityElement({
    pageId,
    componentId,
    elementId: 'search_communities_tab_button',
  });
  const users = useAmityElement({ pageId, componentId, elementId: 'search_users_tab_button' });

  const excluded: Record<GlobalSearchTab, boolean> = {
    posts: posts.isExcluded,
    communities: communities.isExcluded,
    users: users.isExcluded,
  };

  const ORDER: GlobalSearchTab[] = ['posts', 'communities', 'users'];
  const visible = ORDER.filter((tab) => !excluded[tab]);

  return {
    visible,
    /** The tab to land on: the first that survived. */
    first: visible[0] ?? null,
    isVisible: (tab: GlobalSearchTab) => !excluded[tab],
    /**
     * What the field can actually search, which is what its placeholder has to
     * say. "Search my communities" is a lie in a build without Community.
     */
    searchesCommunities: !excluded.communities,
  };
};
