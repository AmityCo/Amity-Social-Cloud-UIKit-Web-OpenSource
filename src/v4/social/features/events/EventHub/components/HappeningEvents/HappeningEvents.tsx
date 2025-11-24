import { useState } from 'react';
import { Typography } from '~/v4/core/components';
import { AmityEventStatus } from '@amityco/ts-sdk';
import { Carousel } from '~/v4/core/components/Carousel';
import { Skeleton } from '~/v4/core/components/Skeleton';
import { useEventsCollection } from '~/v4/social/features/events/hooks';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EventCard } from '~/v4/social/features/events/components/EventCard';
import styles from './HappeningEvents.module.css';

type HappeningEventsProps = Parameters<typeof useEventsCollection>[0];

export function HappeningEvents(props: HappeningEventsProps) {
  const [intersectionRef, setIntersectionRef] = useState<HTMLDivElement | null>(null);

  const {
    hasMore,
    loadMore,
    isLoading,
    items: events,
    isLoadingFirstPage,
  } = useEventsCollection({
    limit: 20,
    status: AmityEventStatus.Live,
    ...props,
  });

  useIntersectionObserver({
    node: intersectionRef,
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  if (isLoadingFirstPage) {
    return (
      <Skeleton className={styles.happeningEvents__skeleton}>
        <Skeleton.Line width="7.5rem" height="0.75rem" />
        <Skeleton.Square width="100%" height="18.125rem" />
        <Skeleton>
          <Skeleton.Line width="7.5rem" height="0.75rem" bottom="0.5rem" />
          <Skeleton.Line width="15.5rem" height="0.75rem" bottom="0.5rem" />
          <Skeleton.Line width="6.25rem" height="0.75rem" bottom="0.5rem" />
        </Skeleton>
      </Skeleton>
    );
  }

  if (events?.length === 0) return null;

  return (
    <section className={styles.happeningEvents}>
      <Typography.TitleBold className={styles.happeningEvents__title}>
        Happening now
      </Typography.TitleBold>
      <Carousel
        scrollOffset={400}
        className={styles.happeningEvents__list}
        isHidden={isLoadingFirstPage || events.length < 2}
        iconClassName={styles.happeningEvents__arrowIcon}
        leftArrowClassName={styles.happeningEvents__arrowLeft}
        rightArrowClassName={styles.happeningEvents__arrowRight}
        dataAttributes={{ 'data-scrollable': events.length > 1 }}
      >
        <div className={styles.happeningEvents__list} data-scrollable={events.length > 1}>
          {!isLoadingFirstPage &&
            !isLoading &&
            events.map((event) => (
              <div key={event.eventId} className={styles.happeningEvent__item}>
                <EventCard variant="card" event={event} size={events.length > 1 ? 'md' : 'lg'} />
              </div>
            ))}
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <Skeleton className={styles.happeningEvent__itemSkeleton} key={index}>
                <Skeleton.Square width="100%" height="9rem" radius="0.5rem 0.5rem 0 0" />
                <Skeleton className={styles.happeningEvent__itemInfoSkeleton}>
                  <Skeleton.Line width="7.5rem" height="0.75rem" bottom="0.5rem" />
                  <Skeleton.Line width="15.5rem" height="0.75rem" bottom="0.5rem" />
                  <Skeleton.Line width="6.25rem" height="0.75rem" bottom="0.5rem" />
                </Skeleton>
              </Skeleton>
            ))}
          {!isLoadingFirstPage && hasMore && <div ref={(node) => setIntersectionRef(node)} />}
        </div>
      </Carousel>
    </section>
  );
}
