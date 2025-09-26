import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { GenericSearchResult } from '~/v4/social/components/GenericSearchResult';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import styles from './AllSearchResult.module.css';

type AllSearchResultProps = {
  pageId?: string;
  onClosePopover?: () => void;
  // Community props
  communityCollection: any[];
  isCommunityLoading: boolean;
  onCommunityLoadMore: () => void;
  // User props
  userCollection: Amity.User[];
  isUserLoading: boolean;
  onUserLoadMore: () => void;
  // Group props
  groupCollection: any[];
  isGroupLoading: boolean;
  onGroupLoadMore: () => void;
  // Tag props
  tagCollection: any[];
  isTagLoading: boolean;
  onTagLoadMore: () => void;
};

export const AllSearchResult = ({
  pageId = '*',
  onClosePopover,
  communityCollection = [],
  isCommunityLoading,
  onCommunityLoadMore,
  userCollection = [],
  isUserLoading,
  onUserLoadMore,
  groupCollection = [],
  isGroupLoading,
  onGroupLoadMore,
  tagCollection = [],
  isTagLoading,
  onTagLoadMore,
}: AllSearchResultProps) => {
  console.log('🚀 ~ AllSearchResult ~ userCollection:', userCollection);
  console.log('🚀 ~ AllSearchResult ~ communityCollection:', communityCollection);
  const componentId = 'all_search_result';

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  // Check if all results are empty and not loading
  const hasResults =
    communityCollection.length > 0 ||
    userCollection.length > 0 ||
    groupCollection.length > 0 ||
    tagCollection.length > 0;

  const isLoading = isCommunityLoading || isUserLoading || isGroupLoading || isTagLoading;

  if (!hasResults && !isLoading) {
    return <EmptySearchResult />;
  }

  return (
    <div className={styles.allSearchResult} style={themeStyles} data-testid={accessibilityId}>
      {/* Communities Section */}
      {(communityCollection.length > 0 || isCommunityLoading) && (
        <div className={styles.allSearchResult__section}>
          <Typography.BodyBold className={styles.allSearchResult__sectionTitle}>
            Communities
          </Typography.BodyBold>
          <GenericSearchResult
            pageId={pageId}
            type="community"
            collection={communityCollection}
            isLoading={isCommunityLoading}
            onClosePopover={onClosePopover}
            onLoadMore={onCommunityLoadMore}
            componentIdSuffix="_all"
          />
        </div>
      )}

      {/* Users Section */}
      {(userCollection.length > 0 || isUserLoading) && (
        <div className={styles.allSearchResult__section}>
          <Typography.BodyBold className={styles.allSearchResult__sectionTitle}>
            Users
          </Typography.BodyBold>
          <GenericSearchResult
            pageId={pageId}
            type="user"
            collection={userCollection}
            isLoading={isUserLoading}
            onClosePopover={onClosePopover}
            onLoadMore={onUserLoadMore}
            componentIdSuffix="_all"
          />
        </div>
      )}

      {/* Groups Section */}
      {(groupCollection.length > 0 || isGroupLoading) && (
        <div className={styles.allSearchResult__section}>
          <Typography.BodyBold className={styles.allSearchResult__sectionTitle}>
            Groups
          </Typography.BodyBold>
          <GenericSearchResult
            pageId={pageId}
            type="group"
            collection={groupCollection}
            isLoading={isGroupLoading}
            onClosePopover={onClosePopover}
            onLoadMore={onGroupLoadMore}
            componentIdSuffix="_all"
          />
        </div>
      )}

      {/* Tags Section */}
      {(tagCollection.length > 0 || isTagLoading) && (
        <div className={styles.allSearchResult__section}>
          <Typography.BodyBold className={styles.allSearchResult__sectionTitle}>
            Tags
          </Typography.BodyBold>
          <GenericSearchResult
            pageId={pageId}
            type="tag"
            collection={tagCollection}
            isLoading={isTagLoading}
            onClosePopover={onClosePopover}
            onLoadMore={onTagLoadMore}
            componentIdSuffix="_all"
          />
        </div>
      )}
    </div>
  );
};
