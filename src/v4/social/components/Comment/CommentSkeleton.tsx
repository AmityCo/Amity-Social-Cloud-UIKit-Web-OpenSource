import React from 'react';
import clsx from 'clsx';
import styles from './CommentSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface CommentSkeletonProps {
  pageId?: string;
  componentId?: string;
  numberOfSkeletons?: number;
}

export const CommentSkeleton = ({
  pageId = '*',
  componentId = '*',
  numberOfSkeletons = 1,
}: CommentSkeletonProps) => {
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  if (isExcluded) return null;

  const skeletons = Array.from({ length: numberOfSkeletons }, (_, index) => (
    <div
      key={index} // Use index as key for each skeleton
      data-qa-anchor={accessibilityId}
      className={clsx(styles.postCommentSkeleton, styles.postCommentSkeleton__animation)}
      style={themeStyles}
    >
      <div
        className={clsx(styles.postCommentSkeleton__avatar, styles.postCommentSkeleton__animation)}
      />
      <div
        className={clsx(styles.postCommentSkeleton__details, styles.postCommentSkeleton__animation)}
      >
        <div
          className={clsx(
            styles.postCommentSkeleton__content,
            styles.postCommentSkeleton__animation,
          )}
        />
        <div className={styles.postCommentSkeleton__content__bar} />
      </div>
    </div>
  ));

  return <div className={styles.postCommentSkeleton__container}>{skeletons}</div>;
};
