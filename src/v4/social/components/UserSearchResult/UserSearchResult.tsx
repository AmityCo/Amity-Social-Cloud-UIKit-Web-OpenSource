import React, { useRef, useState } from 'react';
import styles from './UserSearchResult.module.css';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserSearchItem } from './UserSearchItem';
import { UserSearchItemSkeleton } from './UserSearchItemSkeleton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

interface UserSearchResultProps {
  pageId?: string;
  userCollection: Amity.User[];
  isLoading: boolean;
  onLoadMore: () => void;
}

export const UserSearchResult = ({
  pageId = '*',
  userCollection = [],
  isLoading,
  onLoadMore,
}: UserSearchResultProps) => {
  const componentId = 'user_search_result';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div className={styles.userSearchResult} style={themeStyles} data-qa-anchor={accessibilityId}>
      {userCollection.map((user) => (
        <UserSearchItem pageId={pageId} componentId={componentId} key={user.userId} user={user} />
      ))}
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <UserSearchItemSkeleton key={index} pageId={pageId} componentId={componentId} />
          ))
        : null}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
