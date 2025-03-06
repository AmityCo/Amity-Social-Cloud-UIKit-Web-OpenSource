import React, { useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import useSearchCommunitiesCollection from '~/v4/social/hooks/collections/useSearchCommunitiesCollection';
import styles from './MyCommunitiesSearchPage.module.css';

export function MyCommunitiesSearchPage() {
  const pageId = 'my_communities_search_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const [searchValue, setSearchValue] = useState<string>('');

  const { communities, isLoading, hasMore, loadMore } = useSearchCommunitiesCollection({
    queryParams: {
      displayName: searchValue,
      limit: 20,
      membership: 'member',
    },
    shouldCall: searchValue.length > 0,
  });

  return (
    <div className={styles.myCommunitiesSearchPage} style={themeStyles}>
      <TopSearchBar pageId={pageId} search={(newSearchValue) => setSearchValue(newSearchValue)} />
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
