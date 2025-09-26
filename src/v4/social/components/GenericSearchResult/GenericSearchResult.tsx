import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { SearchResultGenericItem, SearchResultType } from '../SearchResultGenericItem';
import styles from './GenericSearchResult.module.css';

type GenericSearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  collection: any[];
  type: SearchResultType;
  onClosePopover?: () => void;
  componentIdSuffix?: string;
};

const GenericSearchResultSkeleton = ({
  pageId,
  componentId,
}: {
  pageId: string;
  componentId: string;
}) => (
  <div className={styles.genericSearchResult__skeleton}>
    <div className={styles.genericSearchResult__skeleton__avatar} />
    <div className={styles.genericSearchResult__skeleton__content}>
      <div className={styles.genericSearchResult__skeleton__title} />
      <div className={styles.genericSearchResult__skeleton__subtitle} />
    </div>
  </div>
);

export const GenericSearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  collection = [],
  type,
  componentIdSuffix = '',
}: GenericSearchResultProps) => {
  const componentId = `${type}_search_result${componentIdSuffix}`;

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  const getItemKey = (item: any, index: number) => {
    switch (type) {
      case 'user':
        return item.userId;
      case 'community':
        return item.communityId;
      case 'group':
        return item.groupId || index;
      case 'tag':
        return item.tagId || item.name || index;
      default:
        return index;
    }
  };

  return (
    <div className={styles.genericSearchResult} style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.genericSearchResult__noInternetConnectionHoc}
      >
        {collection.length > 0 &&
          collection.map((item, index) => (
            <SearchResultGenericItem
              key={getItemKey(item, index)}
              item={item}
              type={type}
              pageId={pageId}
              onClick={onClosePopover}
              componentId={componentId}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <GenericSearchResultSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && collection.length === 0 && <EmptySearchResult />}
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
