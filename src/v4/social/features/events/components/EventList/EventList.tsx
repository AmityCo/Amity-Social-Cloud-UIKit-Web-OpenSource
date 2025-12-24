import { useState } from 'react';
import EventListSkeleton from './EventListSkeleton';
import EventOutlined from '~/v4/icons/EventOutlined';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useEventsCollection } from '~/v4/social/features/events/hooks';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EventCard } from '~/v4/social/features/events/components/EventCard';
import styles from './EventList.module.css';

type EventListProps = ReturnType<typeof useEventsCollection>;

export function EventList({
  items,
  hasMore,
  loadMore,
  isLoading,
  isLoadingFirstPage,
}: EventListProps) {
  const { isDesktop } = useResponsive();
  const [intersection, setIntersection] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    node: intersection,
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  return (
    <div className={styles.eventList}>
      {!isLoading && !isLoadingFirstPage && items.length === 0 && (
        <EmptyContent
          variant="item"
          text="No events yet"
          defaultIcon={() => <EventOutlined className={styles.eventList__emptyIcon} />}
        />
      )}
      {items.map((event) => (
        <EventCard
          event={event}
          variant="list"
          key={event.eventId}
          size={isDesktop ? 'lg' : 'md'}
        />
      ))}
      {(isLoadingFirstPage || isLoading) && <EventListSkeleton />}
      {!isLoadingFirstPage && hasMore && <div ref={(node) => setIntersection(node)} />}
    </div>
  );
}
