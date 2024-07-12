import React, { useState } from 'react';
import styles from './MyCommunitiesSearchPage.module.css';

import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';
import { useAmityPage } from '~/v4/core/hooks/uikit';

export function MyCommunitiesSearchPage() {
  const pageId = 'my_communities_search_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const [searchValue, setSearchValue] = useState<string>('');

  const { communities, isLoading, hasMore, loadMore } = useCommunitiesCollection({
    displayName: searchValue,
    limit: 20,
    membership: 'member',
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
