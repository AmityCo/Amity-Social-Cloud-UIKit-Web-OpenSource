import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './PostSkeleton.module.css';

export function PostSkeleton() {
  return (
    <Skeleton className={styles.postSkeleton}>
      <Skeleton className={styles.postSkeleton__header}>
        <Skeleton.Circle width="2rem" height="2rem" />
        <Skeleton>
          <Skeleton.Line width="11.25rem" height="0.5rem" bottom="0.5rem" />
          <Skeleton.Line width="4rem" height="0.5rem" />
        </Skeleton>
      </Skeleton>
      <Skeleton.Line width="15rem" height="0.5rem" />
      <Skeleton.Line width="11.25rem" height="0.5rem" />
      <Skeleton.Line width="18.75rem" height="0.5rem" />
    </Skeleton>
  );
}
