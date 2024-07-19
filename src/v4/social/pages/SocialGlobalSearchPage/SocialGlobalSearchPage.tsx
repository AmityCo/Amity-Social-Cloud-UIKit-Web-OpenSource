import React, { useCallback, useState } from 'react';
import styles from './SocialGlobalSearchPage.module.css';

import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import { TabsBar } from '~/v4/social/internal-components/TabsBar';
import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { UserSearchResult } from '../../components/UserSearchResult';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';

enum AmityGlobalSearchType {
  Community = 'community',
  User = 'user',
}

const useGlobalSearchViewModel = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(
    AmityGlobalSearchType.Community,
  );
  const communityCollection = useCommunitiesCollection(
    { displayName: searchKeyword, limit: 20 },
    () => searchType === AmityGlobalSearchType.Community,
  );
  const userCollection = useUserQueryByDisplayName({ displayName: searchKeyword, limit: 20 });

  const search = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  return {
    userCollection,
    communityCollection,
    searchType,
    search,
    setSearchType,
  };
};

export function SocialGlobalSearchPage() {
  const pageId = 'social_global_search_page';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityPage({
      pageId,
    });

  const [activeTab, setActiveTab] = useState('communities');

  const { userCollection, communityCollection, searchType, search, setSearchType } =
    useGlobalSearchViewModel();

  const tabs = [
    {
      value: 'communities',
      label: 'Communities',
      content: () => (
        <CommunitySearchResult
          pageId={pageId}
          communityCollection={communityCollection.communities}
          isLoading={communityCollection.isLoading}
          onLoadMore={() => {
            if (communityCollection.hasMore && communityCollection.isLoading === false) {
              communityCollection.loadMore();
            }
          }}
        />
      ),
    },
    {
      value: 'users',
      label: 'Users',
      content: () => (
        <UserSearchResult
          pageId={pageId}
          userCollection={userCollection.users}
          isLoading={userCollection.isLoading}
          onLoadMore={() => {
            if (userCollection.hasMore && userCollection.isLoading === false) {
              userCollection.loadMore();
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.socialGlobalSearchPage} style={themeStyles}>
      <TopSearchBar pageId={pageId} search={search} />
      <TabsBar
        pageId={pageId}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(newTab) => setActiveTab(newTab)}
      />
    </div>
  );
}
