import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './CommunitySmallListItemSkeleton.module.css';

export function CommunitySmallListItemSkeleton() {
  return (
    <Skeleton className={styles.communitySmallListItemSkeleton}>
      <Skeleton.Circle width="2.5rem" height="2.5rem" />
      <Skeleton.Line width="8.75rem" height="0.625rem" />
    </Skeleton>
  );
}
