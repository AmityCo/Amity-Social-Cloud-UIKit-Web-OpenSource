import { useEffect, useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements';
import styles from './EventAttendees.module.css';
import { SearchResultSkeleton } from '~/v4/social/internal-components/SearchResultSkeleton/SearchResultSkeleton';
import useRSVPEventsCollection from '~/v4/social/features/events/hooks/useRSVPEventsCollection';
import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { UserItem } from '~/v4/social/pages/UserRelationshipPage/TabContent/UserRelationshipList/UserItem';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

export type EventAttendeesProps = {
  event: Amity.Event;
};

export const EventAttendees = ({ event }: EventAttendeesProps) => {
  const pageId = 'event_attendees_page';
  const { onBack } = useNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { items, isLoading, isLoadingFirstPage, hasMore, loadMore } = useRSVPEventsCollection({
    event,
    status: AmityEventResponseStatus.Going,
    shouldCall: !!event,
    limit: 20,
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (!isLoading) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const showLoading = isLoadingFirstPage || isLoading;

  return (
    <div ref={containerRef}>
      <div data-scrolled={isScrolled} className={styles.eventAttendees__topBar}>
        <BackButton onPress={() => onBack()} />
        <Typography.TitleBold>Attendees</Typography.TitleBold>
        <div className={styles.eventAttendees__spacer} />
      </div>

      <div className={styles.eventAttendees__content}>
        {!showLoading &&
          items.length > 0 &&
          items.map((data) => (
            <UserItem
              key={data.userId}
              userId={data.userId}
              pageId={pageId}
              componentId={data.userId}
              isShowMenuButton={false}
            />
          ))}
        {showLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <SearchResultSkeleton key={index} pageId={pageId} />
          ))}
      </div>
      {hasMore && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.eventAttendees__bottomHeight}
        />
      )}
    </div>
  );
};
