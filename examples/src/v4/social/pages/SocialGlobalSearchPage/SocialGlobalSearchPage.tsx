import { Key } from 'react-aria';
import { UserRepository } from '@amityco/ts-sdk';
import { useClickAway } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GenericSearchResult } from '~/v4/social/components/GenericSearchResult';
import { AllSearchResult } from '~/v4/social/components/AllSearchResult';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import styles from './SocialGlobalSearchPage.module.css';
import useSearchCommunitiesCollection from '~/v4/social/hooks/collections/useSearchCommunitiesCollection';

enum AmityGlobalSearchType {
  All = 'all',
  User = 'user',
  Community = 'community',
  Tag = 'tag',
  Group = 'group',
}

const useGlobalSearchViewModel = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(AmityGlobalSearchType.All);

  const enabledUserSearch = useMemo(
    () =>
      (searchType === AmityGlobalSearchType.User || searchType === AmityGlobalSearchType.All) &&
      searchKeyword.length > 0,
    [searchType, searchKeyword],
  );

  const enabledGroupSearch = useMemo(
    () =>
      (searchType === AmityGlobalSearchType.Group || searchType === AmityGlobalSearchType.All) &&
      searchKeyword.length > 0,
    [searchType, searchKeyword],
  );

  const enabledTagSearch = useMemo(
    () =>
      (searchType === AmityGlobalSearchType.Tag || searchType === AmityGlobalSearchType.All) &&
      searchKeyword.length > 0,
    [searchType, searchKeyword],
  );

  const communityCollection = useSearchCommunitiesCollection({
    queryParams: {
      displayName: searchKeyword,
      limit: 20,
      includeDiscoverablePrivateCommunity: true,
      membership: 'all',
    },
    shouldCall:
      (searchType === AmityGlobalSearchType.Community ||
        searchType === AmityGlobalSearchType.All) &&
      searchKeyword.length > 0,
  });

  const userCollection = useUserQueryByDisplayName({
    displayName: searchKeyword,
    limit: 20,
    enabled: enabledUserSearch,
    matchType: UserRepository.AmityUserSearchMatchType.PARTIAL,
  });

  const groupCollection = {
    groups: enabledGroupSearch ? [] : [],
    isLoading: false,
    hasMore: false,
    loadMore: () => {},
  };

  const tagCollection = {
    tags: enabledTagSearch ? [] : [],
    isLoading: false,
    hasMore: false,
    loadMore: () => {},
  };

  const search = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
    },
    [setSearchKeyword],
  );

  return {
    userCollection,
    communityCollection,
    groupCollection,
    tagCollection,
    searchType,
    search,
    searchValue: searchKeyword,
    setSearchType,
  };
};

export function SocialGlobalSearchPage() {
  const pageId = 'social_global_search_page';

  const ref = useRef<HTMLDivElement>(null);
  const { themeStyles } = useAmityPage({ pageId });
  const [activeTab, setActiveTab] = useState<Key>('');
  const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);
  const {
    userCollection,
    communityCollection,
    groupCollection,
    tagCollection,
    search,
    searchValue,
    setSearchType,
  } = useGlobalSearchViewModel();

  useClickAway(ref, () => setOpenSearchResult(false));

  const tabs = [
    {
      value: 'communities',
      label: 'Communities',
      accessibilityId: `${pageId}/top_search_bar/communities`,
      content: () => (
        <GenericSearchResult
          pageId={pageId}
          type="community"
          collection={communityCollection.communities}
          isLoading={communityCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
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
        <GenericSearchResult
          pageId={pageId}
          type="user"
          collection={userCollection.users}
          isLoading={userCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
          onLoadMore={() => {
            if (userCollection.hasMore && userCollection.isLoading === false) {
              userCollection.loadMore();
            }
          }}
        />
      ),
    },
    {
      value: 'groups',
      label: 'Groups',
      accessibilityId: `${pageId}/top_search_bar/groups`,
      content: () => (
        <GenericSearchResult
          pageId={pageId}
          type="group"
          collection={groupCollection.groups}
          isLoading={groupCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
          onLoadMore={() => {
            if (groupCollection.hasMore && groupCollection.isLoading === false) {
              groupCollection.loadMore();
            }
          }}
        />
      ),
    },
    {
      value: 'tags',
      label: 'Tags',
      accessibilityId: `${pageId}/top_search_bar/tags`,
      content: () => (
        <GenericSearchResult
          pageId={pageId}
          type="tag"
          collection={tagCollection.tags}
          isLoading={tagCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
          onLoadMore={() => {
            if (tagCollection.hasMore && tagCollection.isLoading === false) {
              tagCollection.loadMore();
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
        hasCancelButton={false}
      />
      {searchValue.length > 0 && openSearchResult && (
        <div className={styles.socialGlobalSearchPage__searchResultContainer} ref={ref}>
          <div className={styles.socialGlobalSearchPage__tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`${styles.secondaryTabButton} ${activeTab === tab.value ? styles.secondaryTabButtonActive : ''}`}
                onClick={() => {
                  if (activeTab === tab.value) {
                    setActiveTab('');
                    setSearchType(AmityGlobalSearchType.All);
                    return;
                  }

                  setActiveTab(tab.value);
                  let searchType: AmityGlobalSearchType;
                  switch (tab.value) {
                    case 'communities':
                      searchType = AmityGlobalSearchType.Community;
                      break;
                    case 'users':
                      searchType = AmityGlobalSearchType.User;
                      break;
                    case 'groups':
                      searchType = AmityGlobalSearchType.Group;
                      break;
                    case 'tags':
                      searchType = AmityGlobalSearchType.Tag;
                      break;
                    default:
                      searchType = AmityGlobalSearchType.All;
                  }
                  setSearchType(searchType);
                }}
                data-testid={tab.accessibilityId}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab !== '' && (
            <div className={styles.socialGlobalSearchPage__tabPanel}>
              {tabs.find((tab) => tab.value === activeTab)?.content()}
            </div>
          )}
          {activeTab === '' && (
            <div className={styles.socialGlobalSearchPage__tabPanel}>
              <AllSearchResult
                pageId={pageId}
                onClosePopover={() => setOpenSearchResult(false)}
                communityCollection={communityCollection.communities}
                isCommunityLoading={communityCollection.isLoading}
                onCommunityLoadMore={() => {
                  if (communityCollection.hasMore && communityCollection.isLoading === false) {
                    communityCollection.loadMore();
                  }
                }}
                userCollection={userCollection.users}
                isUserLoading={userCollection.isLoading}
                onUserLoadMore={() => {
                  if (userCollection.hasMore && userCollection.isLoading === false) {
                    userCollection.loadMore();
                  }
                }}
                groupCollection={groupCollection.groups}
                isGroupLoading={groupCollection.isLoading}
                onGroupLoadMore={() => {
                  if (groupCollection.hasMore && groupCollection.isLoading === false) {
                    groupCollection.loadMore();
                  }
                }}
                tagCollection={tagCollection.tags}
                isTagLoading={tagCollection.isLoading}
                onTagLoadMore={() => {
                  if (tagCollection.hasMore && tagCollection.isLoading === false) {
                    tagCollection.loadMore();
                  }
                }}
              />
            </div>
          )}
          <div className={styles.socialGlobalSearchPage__searchResultContainer__footer} />
        </div>
      )}
    </div>
  );
}
