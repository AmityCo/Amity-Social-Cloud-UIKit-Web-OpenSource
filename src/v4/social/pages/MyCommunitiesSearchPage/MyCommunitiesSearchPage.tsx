import React, { useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import useSearchCommunitiesCollection from '~/v4/social/hooks/collections/useSearchCommunitiesCollection';
import styles from './MyCommunitiesSearchPage.module.css';

export function MyCommunitiesSearchPage() {
  const pageId = 'my_communities_search_page';
  const { themeStyles, isExcluded } = useAmityPage({
    pageId,
  });

  const [searchValue, setSearchValue] = useState<string>('');

  const { communities, isLoading, hasMore, loadMore } = useSearchCommunitiesCollection({
    queryParams: {
      displayName: searchValue,
      limit: 20,
      membership: 'member',
      includeDiscoverablePrivateCommunity: true,
    },
    shouldCall: searchValue.length > 0,
  });

  // A module switched off renders nothing, so a stale route or deep
  // link lands on emptiness rather than a page with holes in it.
  if (isExcluded) return null;

  return (
    <div className={styles.myCommunitiesSearchPage} style={themeStyles}>
      <TopSearchBar
        pageId={pageId}
        // The bar's default is plain "Search", which is what global search wants.
        // This page searches one list, so it says so — the same split Android
        // makes, where the placeholder is "Search my communities" for
        // MY_COMMUNITY and "Search" for every other search type.
        placeholderKey="amity_social_label_search_my_communities"
        inputTestId="my-communities-search-input"
        search={(newSearchValue) => setSearchValue(newSearchValue)}
      />
      {searchValue.length > 0 && (
        <CommunitySearchResult
          pageId={pageId}
          communityCollection={communities}
          isLoading={isLoading}
          onLoadMore={() => {
            if (hasMore && isLoading === false) {
              loadMore();
            }
          }}
        />
      )}
    </div>
  );
}
