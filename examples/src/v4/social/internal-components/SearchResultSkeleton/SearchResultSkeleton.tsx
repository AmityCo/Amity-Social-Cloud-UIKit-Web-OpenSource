import React from 'react';
import styles from './SearchResultSkeleton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type SearchResultSkeletonProps = {
  pageId?: string;
  componentId?: string;
};

export const SearchResultSkeleton = ({
  pageId = '*',
  componentId = '*',
}: SearchResultSkeletonProps) => {
  const elementId = 'search_result_skeleton';
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.searchResultSkeleton__postSkeleton}
    >
      <div className={styles.searchResultSkeleton__postSkeletonHeader}>
        <div className={styles.searchResultSkeleton__postSkeletonAvatar}></div>
        <div className={styles.searchResultSkeleton__postSkeletonLine}></div>
      </div>
    </div>
  );
};
