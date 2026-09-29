import { Key } from 'react-aria';
import { resolveString } from '~/v4/core/localization';
import { FeedDataTypeEnum, UserRepository } from '@amityco/ts-sdk';
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
import { useGlobalSearchTabs } from '~/v4/social/hooks/useGlobalSearchTabs';
import styles from './SocialGlobalSearchPage.module.css';

enum AmityGlobalSearchType {
  User = 'user',
  Community = 'community',
}

const useGlobalSearchViewModel = ({
  keyword,
  canSearchCommunities,
}: {
  keyword?: string;
  canSearchCommunities: boolean;
}) => {
  const { searchValue, setSearchValue } = useSearchResultContext();
  const previousKeywordRef = useRef<string | undefined>(keyword ?? searchValue);
  const isInitialMount = useRef<boolean>(true);

  // Seeded from what this build can search. Starting on Community regardless
  // meant a build without it opened asking for communities.
  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(
    canSearchCommunities ? AmityGlobalSearchType.Community : AmityGlobalSearchType.User,
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
    targetType: 'all',
    hashtags:
      searchValue && searchValue.length > 0 && searchValue.startsWith('#')
        ? [searchValue.startsWith('#') ? searchValue.slice(1) : searchValue]
        : [],
    matchingOnlyParentPost: true,
    dataTypes: [
      FeedDataTypeEnum.Text,
      FeedDataTypeEnum.Image,
      FeedDataTypeEnum.Video,
      FeedDataTypeEnum.Poll,
      FeedDataTypeEnum.Clip,
      FeedDataTypeEnum.LiveStream,
    ],
  });

  const semanticPostCollection = useSemanticSearchPostCollection({
    query: searchValue && searchValue.length > 0 && !searchValue.startsWith('#') ? searchValue : '',
    matchingOnlyParentPost: true,
    dataTypes: [FeedDataTypeEnum.Text, FeedDataTypeEnum.Image],
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

  const ref = useRef<HTMLDivElement>(null);
  const { themeStyles, isExcluded } = useAmityPage({ pageId });

  // Which tabs this build has. Discovery survives Community off, so the row
  // stays and only the tabs whose module went may go — and the tab it lands on
  // has to be one that is still there, or the body never draws.
  const searchTabs = useGlobalSearchTabs(pageId);
  const DEFAULT_ACTIVE_TAB: Key = searchTabs.first ?? 'users';
  const [activeTab, setActiveTab] = useState<Key>(DEFAULT_ACTIVE_TAB);
  const { openSearchResult, setOpenSearchResult, resetSearchValue } = useSearchResultContext();
  const {
    userCollection,
    communityCollection,
    postCollection,
    search,
    searchValue,
    setSearchType,
  } = useGlobalSearchViewModel({ keyword, canSearchCommunities: searchTabs.searchesCommunities });
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

  // R5: a tab that the row does not draw is a tab whose body never draws.
  useEffect(() => {
    if (!searchTabs.isVisible(activeTab as never) && searchTabs.first) {
      setActiveTab(searchTabs.first);
    }
  }, [activeTab, searchTabs.first]);

  useClickAway(ref, () => {
    if (isDesktop) {
      resetSearchValue();
      setActiveTab(DEFAULT_ACTIVE_TAB);
      setOpenSearchResult(false);
    }
  });

  // resolveString, not useString: it is a plain function, so a tab can be built
  // conditionally without the entry count changing the hook count. Building the
  // whole row and filtering after was the way around React #300; resolving the
  // label outside the hook rules removes the constraint instead of dodging it.
  const tabs = [
    ...(searchTabs.isVisible('posts')
      ? [
          {
            value: 'posts',
            label: resolveString('amity_social_label_title_posts'),
            accessibilityId: `${pageId}/top_search_bar/search_posts_tab_button`,
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
        ]
      : []),
    ...(searchTabs.isVisible('communities')
      ? [
          {
            value: 'communities',
            label: resolveString('amity_social_button_social_home_communities_button'),
            accessibilityId: `${pageId}/top_search_bar/search_communities_tab_button`,
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
        ]
      : []),
    ...(searchTabs.isVisible('users')
      ? [
          {
            value: 'users',
            label: resolveString('amity_social_tab_tab_users'),
            accessibilityId: `${pageId}/top_search_bar/search_users_tab_button`,
            content: () => (
              <UserSearchResult
                pageId={pageId}
                keyword={searchValue}
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
        ]
      : []),
  ];

  // A module switched off renders nothing, so a stale route or deep
  // link lands on emptiness rather than a page with holes in it.
  if (isExcluded) return null;

  return (
    <div className={styles.socialGlobalSearchPage} style={themeStyles}>
      <TopSearchBar
        pageId={pageId}
        search={search}
        onFocus={() => setOpenSearchResult(true)}
        initialValue={searchValue}
        hasCancelButton={false}
        onCloseSearch={() => setActiveTab(DEFAULT_ACTIVE_TAB)}
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
