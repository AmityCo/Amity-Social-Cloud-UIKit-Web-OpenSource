import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './GlobalFeedStorySkeleton.module.css';

export function GlobalFeedStorySkeleton() {
  return (
    <Skeleton className={styles.globalFeedStorySkeleton}>
      <div className={styles.globalFeedStorySkeleton__avatar}>
        <Skeleton.Circle width="4rem" height="4rem" />
      </div>
      <div className={styles.globalFeedStorySkeleton__displayName}>
        <Skeleton.Line width="4rem" height="0.625rem" />
      </div>
    </Skeleton>
  );
}
