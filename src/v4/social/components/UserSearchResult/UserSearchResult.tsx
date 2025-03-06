import React, { useState } from 'react';
import { UserSearchItem } from './UserSearchItem';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserSearchItemSkeleton } from './UserSearchItemSkeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './UserSearchResult.module.css';

type UserSearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  userCollection: Amity.User[];
  onClosePopover?: () => void;
};

export const UserSearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  userCollection = [],
}: UserSearchResultProps) => {
  const componentId = 'user_search_result';

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div className={styles.userSearchResult} style={themeStyles} data-qa-anchor={accessibilityId}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.userSearchResult__noInternetConnectionHoc}
      >
        {userCollection.length > 0 &&
          userCollection.map((user) => (
            <UserSearchItem
              user={user}
              pageId={pageId}
              key={user.userId}
              onClick={onClosePopover}
              componentId={componentId}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <UserSearchItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && userCollection.length === 0 && <EmptySearchResult />}
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
