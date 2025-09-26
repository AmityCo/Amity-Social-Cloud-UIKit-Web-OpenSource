import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { GroupSearchItem } from './GroupSearchItem';
import { GroupSearchItemSkeleton } from './GroupSearchItemSkeleton';
import styles from './GroupSearchResult.module.css';

type GroupSearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  groupCollection: any[];
  onClosePopover?: () => void;
};

export const GroupSearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  groupCollection = [],
}: GroupSearchResultProps) => {
  const componentId = 'group_search_result';

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div className={styles.groupSearchResult} style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.groupSearchResult__noInternetConnectionHoc}
      >
        {groupCollection.length > 0 &&
          groupCollection.map((group, index) => (
            <GroupSearchItem
              group={group}
              pageId={pageId}
              key={group.groupId || index}
              onClick={onClosePopover}
              componentId={componentId}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <GroupSearchItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && groupCollection.length === 0 && <EmptySearchResult />}
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
