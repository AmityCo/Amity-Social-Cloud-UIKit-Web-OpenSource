import React from 'react';
import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './ProductMentionItemSkeleton.module.css';

export const ProductMentionItemSkeleton = () => {
  return (
    <div className={styles.productMentionItemSkeleton}>
      <Skeleton.Square width="2.5rem" height="2.5rem" radius="0.25rem" />
      <Skeleton.Line width="60%" height="0.5rem" radius="0.75rem" />
    </div>
  );
};
