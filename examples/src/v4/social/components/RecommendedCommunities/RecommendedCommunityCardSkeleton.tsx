import clsx from 'clsx';
import React from 'react';

import styles from './RecommendedCommunityCardSkeleton.module.css';

export const RecommendedCommunityCardSkeleton = () => (
  <div className={styles.recommendedCommunityCardSkeleton}>
    <div
      className={clsx(
        styles.recommendedCommunityCardSkeleton__image,
        styles.recommendedCommunityCardSkeleton__animation,
      )}
    />
    <div
      className={clsx(
        styles.recommendedCommunityCardSkeleton__content,
        styles.recommendedCommunityCardSkeleton__animation,
      )}
    >
      <div
        className={clsx(
          styles.recommendedCommunityCardSkeleton__contentBar1,
          styles.recommendedCommunityCardSkeleton__animation,
        )}
      />
      <div
        className={clsx(
          styles.recommendedCommunityCardSkeleton__contentBar2,
          styles.recommendedCommunityCardSkeleton__animation,
        )}
      />
      <div
        className={clsx(
          styles.recommendedCommunityCardSkeleton__contentBar3,
          styles.recommendedCommunityCardSkeleton__animation,
        )}
      />
    </div>
  </div>
);
