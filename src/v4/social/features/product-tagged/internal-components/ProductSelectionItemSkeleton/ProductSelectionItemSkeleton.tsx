import React from 'react';
import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import styles from './ProductSelectionItemSkeleton.module.css';

export const ProductSelectionItemSkeleton = () => {
  return (
    <Skeleton className={styles.productSelectionItemSkeleton}>
      <Skeleton.Square
        width="5rem"
        height="5rem"
        className={styles.productSelectionItemSkeleton__mediaPlaceholder}
      />
      <Skeleton.Line width="40%" height="0.5rem" />
    </Skeleton>
  );
};
