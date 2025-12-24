import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './UserListItemSkeleton.module.css';

export function UserListItemSkeleton() {
  return (
    <Skeleton className={styles.userListItemSkeleton}>
      <Skeleton.Circle width="2rem" height="2rem" />
      <Skeleton.Line width="8.75rem" height="0.6255rem" />
    </Skeleton>
  );
}
