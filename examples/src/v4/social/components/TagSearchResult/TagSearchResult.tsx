import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { TagSearchItem } from './TagSearchItem';
import { TagSearchItemSkeleton } from './TagSearchItemSkeleton';
import styles from './TagSearchResult.module.css';

type TagSearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  tagCollection: any[];
  onClosePopover?: () => void;
};

export const TagSearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  tagCollection = [],
}: TagSearchResultProps) => {
  const componentId = 'tag_search_result';

  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div className={styles.tagSearchResult} style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.tagSearchResult__noInternetConnectionHoc}
      >
        {tagCollection.length > 0 &&
          tagCollection.map((tag, index) => (
            <TagSearchItem
              tag={tag}
              pageId={pageId}
              key={tag.tagId || tag.name || index}
              onClick={onClosePopover}
              componentId={componentId}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <TagSearchItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && tagCollection.length === 0 && <EmptySearchResult />}
      </NoInternetConnectionHoc>

      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
