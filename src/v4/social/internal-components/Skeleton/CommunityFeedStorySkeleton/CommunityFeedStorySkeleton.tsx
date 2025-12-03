import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './CommunityFeedStorySkeleton.module.css';

export function CommunityFeedStorySkeleton() {
  return (
    <Skeleton className={styles.communityFeedStorySkeleton}>
      <div className={styles.communityFeedStorySkeleton__avatar}>
        <Skeleton.Circle width="2.5rem" height="2.5rem" />
      </div>
      <div className={styles.communityFeedStorySkeleton__displayName}>
        <Skeleton.Line width="2.5rem" height="0.625rem" />
      </div>
    </Skeleton>
  );
}
