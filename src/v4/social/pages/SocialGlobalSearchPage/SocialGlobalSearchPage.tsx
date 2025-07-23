import { Key } from 'react-aria';
import { UserRepository } from '@amityco/ts-sdk';
import { useClickAway } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { SecondaryTab } from '~/v4/core/components/SecondaryTab';
import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserSearchResult } from '~/v4/social/components/UserSearchResult';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import useSearchCommunitiesCollection from '~/v4/social/hooks/collections/useSearchCommunitiesCollection';
import { PostSearchResult } from '~/v4/social/components/PostSearchResult';
import useSearchPostWithHashtagCollection from '~/v4/social/hooks/collections/useSearchPostWithHashtagCollection';
import useSemanticSearchPostCollection from '~/v4/social/hooks/collections/useSemanticSearchPostCollection';
import { useSearchResultContext } from '~/v4/social/providers/SearchResultProvider';
import styles from './SocialGlobalSearchPage.module.css';

enum AmityGlobalSearchType {
  User = 'user',
  Community = 'community',
}

const useGlobalSearchViewModel = ({ keyword }: { keyword?: string }) => {
  const [searchKeyword, setSearchKeyword] = useState<string>(keyword || '');
  const previousKeywordRef = useRef<string | undefined>(keyword);
  const isInitialMount = useRef<boolean>(true);

  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(
    AmityGlobalSearchType.Community,
  );

  // Update searchKeyword when keyword prop changes (for navigation back from post detail)
  useEffect(() => {
    // On initial mount, just update the ref and don't change the search value
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousKeywordRef.current = keyword;

      return;
    }

    // Only update search value if keyword prop actually changed (indicates back navigation)
    if (keyword !== undefined && keyword !== previousKeywordRef.current) {
      setSearchKeyword(keyword);
      previousKeywordRef.current = keyword;
    }
  }, [keyword]);

  const enabledUserSearch = useMemo(
    () => searchType === AmityGlobalSearchType.User && searchKeyword.length > 0,
    [searchType, searchKeyword],
  );

  const communityCollection = useSearchCommunitiesCollection({
    queryParams: {
      displayName: searchKeyword,
      limit: 20,
      includeDiscoverablePrivateCommunity: true,
      membership: 'all',
    },
    shouldCall: searchType === AmityGlobalSearchType.Community && searchKeyword.length > 0,
  });

  const userCollection = useUserQueryByDisplayName({
    displayName: searchKeyword,
    limit: 20,
    enabled: enabledUserSearch,
    matchType: UserRepository.AmityUserSearchMatchType.PARTIAL,
  });

  const postWithHashtagCollection = useSearchPostWithHashtagCollection({
    hashtags:
      searchKeyword && searchKeyword.length > 0 && searchKeyword.startsWith('#')
        ? [searchKeyword.startsWith('#') ? searchKeyword.slice(1) : searchKeyword]
        : [],
    dataTypes: ['text', 'image'],
  });

  const semanticPostCollection = useSemanticSearchPostCollection({
    query:
      searchKeyword && searchKeyword.length > 0 && !searchKeyword.startsWith('#')
        ? searchKeyword
        : '',
  });

  // Use the appropriate collection based on search type
  const activePostCollection = searchKeyword.startsWith('#')
    ? postWithHashtagCollection
    : semanticPostCollection;

  const search = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
    },
    [setSearchKeyword],
  );

  return {
    userCollection,
    communityCollection,
    postCollection: activePostCollection,
    searchType,
    search,
    searchValue: searchKeyword,
    setSearchType,
  };
};

export function SocialGlobalSearchPage({ keyword }: { keyword?: string }) {
  const pageId = 'social_global_search_page';

  const DEFAULT_ACTIVE_TAB: Key = 'posts';
  const ref = useRef<HTMLDivElement>(null);
  const { themeStyles } = useAmityPage({ pageId });
  const [activeTab, setActiveTab] = useState<Key>(DEFAULT_ACTIVE_TAB);
  const { openSearchResult, setOpenSearchResult, resetSearchValue } = useSearchResultContext();
  const {
    userCollection,
    communityCollection,
    postCollection,
    search,
    searchValue,
    setSearchType,
  } = useGlobalSearchViewModel({ keyword });

  // Show search results if there's an initial keyword or current search value
  useEffect(() => {
    if (searchValue.length > 0) {
      setOpenSearchResult(true);
    }
  }, [searchValue]);

  // Set initial search results visibility based on keyword prop
  useEffect(() => {
    if (keyword && keyword.length > 0) {
      setOpenSearchResult(true);
    }
  }, [keyword]);

  useClickAway(ref, () => {
    resetSearchValue();
    setOpenSearchResult(false);
  });

  const tabs = [
    {
      value: 'posts',
      label: 'Posts',
      accessibilityId: `${pageId}/top_search_bar/posts`,
      content: () => (
        <PostSearchResult
          pageId={pageId}
          keyword={searchValue}
          isLoading={postCollection.loading}
          postCollection={postCollection.posts as Amity.Post[]}
          onLoadMore={() => {
            if (postCollection.hasMore && postCollection.loading === false) {
              postCollection.loadMore();
            }
          }}
        />
      ),
    },
    {
      value: 'communities',
      label: 'Communities',
      accessibilityId: `${pageId}/top_search_bar/communities`,
      content: () => (
        <CommunitySearchResult
          pageId={pageId}
          isLoading={communityCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
          communityCollection={communityCollection.communities}
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
      accessibilityId: `${pageId}/top_search_bar/users`,
      content: () => (
        <UserSearchResult
          pageId={pageId}
          isLoading={userCollection.isLoading}
          userCollection={userCollection.users}
          onClosePopover={() => setOpenSearchResult(false)}
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
      <TopSearchBar
        pageId={pageId}
        search={search}
        onFocus={() => setOpenSearchResult(true)}
        initialValue={searchValue}
        hasCancelButton={false}
      />
      {(searchValue.length > 0 || (keyword && keyword.length > 0)) && openSearchResult && (
        <div className={styles.socialGlobalSearchPage__searchResultContainer} ref={ref}>
          <SecondaryTab
            tabs={tabs}
            activeTab={activeTab}
            tabListClassName={styles.socialGlobalSearchPage__tabs}
            tabPanelClassName={styles.socialGlobalSearchPage__tabPanel}
            onChange={(newTab) => {
              setActiveTab(newTab);
              setSearchType(
                newTab === 'communities'
                  ? AmityGlobalSearchType.Community
                  : AmityGlobalSearchType.User,
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
