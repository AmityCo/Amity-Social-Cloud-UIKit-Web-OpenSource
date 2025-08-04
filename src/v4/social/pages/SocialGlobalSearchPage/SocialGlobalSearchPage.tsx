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
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './SocialGlobalSearchPage.module.css';

enum AmityGlobalSearchType {
  User = 'user',
  Community = 'community',
}

const useGlobalSearchViewModel = ({ keyword }: { keyword?: string }) => {
  const { searchValue, setSearchValue } = useSearchResultContext();
  const previousKeywordRef = useRef<string | undefined>(keyword ?? searchValue);
  const isInitialMount = useRef<boolean>(true);

  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(
    AmityGlobalSearchType.Community,
  );

  // Update searchValue when keyword prop changes (for navigation back from post detail)
  useEffect(() => {
    // On initial mount, just update the ref and don't change the search value
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousKeywordRef.current = keyword || searchValue;

      // If keyword is provided and different from current searchValue, update it
      if (keyword !== undefined && keyword !== searchValue) {
        setSearchValue?.(keyword);
      }

      return;
    }

    // Only update search value if keyword prop actually changed (indicates back navigation)
    if (keyword !== undefined && keyword !== previousKeywordRef.current) {
      setSearchValue(keyword);
      previousKeywordRef.current = keyword;
    }
  }, [keyword, searchValue, setSearchValue]);

  const enabledUserSearch = useMemo(
    () => searchType === AmityGlobalSearchType.User && searchValue.length > 0,
    [searchType, searchValue],
  );

  const communityCollection = useSearchCommunitiesCollection({
    queryParams: {
      displayName: searchValue,
      limit: 20,
      includeDiscoverablePrivateCommunity: true,
      membership: 'all',
    },
    shouldCall: searchType === AmityGlobalSearchType.Community && searchValue.length > 0,
  });

  const userCollection = useUserQueryByDisplayName({
    displayName: searchValue,
    limit: 20,
    enabled: enabledUserSearch,
    matchType: UserRepository.AmityUserSearchMatchType.PARTIAL,
  });

  const postWithHashtagCollection = useSearchPostWithHashtagCollection({
    hashtags:
      searchValue && searchValue.length > 0 && searchValue.startsWith('#')
        ? [searchValue.startsWith('#') ? searchValue.slice(1) : searchValue]
        : [],
  });

  const semanticPostCollection = useSemanticSearchPostCollection({
    query: searchValue && searchValue.length > 0 && !searchValue.startsWith('#') ? searchValue : '',
  });

  // Use the appropriate collection based on search type
  const activePostCollection = searchValue.startsWith('#')
    ? postWithHashtagCollection
    : semanticPostCollection;

  const search = useCallback(
    (keyword: string) => {
      setSearchValue(keyword);
    },
    [setSearchValue],
  );

  return {
    userCollection,
    communityCollection,
    postCollection: activePostCollection,
    searchType,
    search,
    searchValue,
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
  const { isDesktop } = useResponsive();

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
    if (isDesktop) {
      resetSearchValue();
      setActiveTab(DEFAULT_ACTIVE_TAB);
      setOpenSearchResult(false);
    }
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
