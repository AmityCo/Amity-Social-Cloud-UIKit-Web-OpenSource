import React from 'react';
import clsx from 'clsx';
import styles from './PostContentSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface PostContentSkeletonProps {
  pageId?: string;
}

export const PostContentSkeleton = ({ pageId = '*' }: PostContentSkeletonProps) => {
  const componentId = 'post_content';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={clsx(styles.postContentSkeleton, styles.postContentSkeleton__animation)}
    >
      <div className={clsx(styles.postContentSkeleton__bar, styles.postContentSkeleton__animation)}>
        <div
          className={clsx(
            styles.postContentSkeleton__bar__userAvatar,
            styles.postContentSkeleton__animation,
          )}
        ></div>
        <div
          className={clsx(
            styles.postContentSkeleton__bar__information,
            styles.postContentSkeleton__animation,
          )}
        >
          <div
            className={clsx(
              styles.postContentSkeleton__bar__information__title,
              styles.postContentSkeleton__animation,
            )}
          />
          <div
            className={clsx(
              styles.postContentSkeleton__bar__information__subtitle,
              styles.postContentSkeleton__animation,
            )}
          />
        </div>
      </div>
      <div
        className={clsx(styles.postContentSkeleton__content, styles.postContentSkeleton__animation)}
      >
        <div
          className={clsx(
            styles.postContentSkeleton__content__bar1,
            styles.postContentSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.postContentSkeleton__content__bar2,
            styles.postContentSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.postContentSkeleton__content__bar3,
            styles.postContentSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
