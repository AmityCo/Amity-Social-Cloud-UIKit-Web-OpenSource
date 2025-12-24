import { Skeleton } from '~/v4/core/components/Skeleton';
import styles from './EventListSkeleton.module.css';

type EventListSkeletonProps = {
  count?: number;
};

function EventListSkeleton({ count = 3 }: EventListSkeletonProps) {
  return (
    <Skeleton className={styles.eventListSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton className={styles.eventListSkeleton__item} key={index}>
          <Skeleton.Square width="100%" height="7.5rem" />
          <Skeleton className={styles.eventListSkeleton__itemContent}>
            <Skeleton.Line width="8.75rem" height="0.75rem" bottom="0.5rem" />
            <Skeleton.Line width="10.25rem" height="0.75rem" bottom="0.5rem" />
            <Skeleton.Line width="7.5rem" height="0.75rem" bottom="0.5rem" />
          </Skeleton>
        </Skeleton>
      ))}
    </Skeleton>
  );
}

export default EventListSkeleton;
