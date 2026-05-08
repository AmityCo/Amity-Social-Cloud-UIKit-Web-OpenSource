import useSDK from '~/v4/core/hooks/useSDK';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { AmityEventStatus } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/components/AriaButton';
import { Skeleton } from '~/v4/core/components/Skeleton';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { useEventsCollection } from '~/v4/social/features/events/hooks';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { EventList } from '~/v4/social/features/events/components/EventList';
import EventListSkeleton from '~/v4/social/features/events/components/EventList/EventListSkeleton';
import styles from './MyEvents.module.css';

type MyEventsProps = {
  pageId?: string;
};

export function MyEvents({ pageId = '*' }: MyEventsProps) {
  const componentId = COMPONENT_ID.MY_EVENTS;

  const { currentUserId } = useSDK();
  const { AmityMyEventFeedComponentBehavior } = usePageBehavior();
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const upcomingEventCollection = useEventsCollection({
    limit: 10,
    onlyAttendee: true,
    shouldCall: !!currentUserId,
    userId: currentUserId!,
    status: AmityEventStatus.Scheduled,
  });

  const pastEventCollection = useEventsCollection({
    limit: 10,
    onlyAttendee: true,
    shouldCall: !!currentUserId,
    userId: currentUserId!,
    status: AmityEventStatus.Ended,
  });

  if (isExcluded) return null;

  return (
    <section className={styles.myEvents} style={themeStyles} data-testid={accessibilityId}>
      {upcomingEventCollection.isLoadingFirstPage ? (
        <Skeleton className={styles.myEvents__section}>
          <Skeleton.Line width="8.75rem" height="0.75rem" />
          <EventListSkeleton />
        </Skeleton>
      ) : (
        <div className={styles.myEvents__section}>
          <Typography.TitleBold className={styles.myEvents__sectionTitle}>
            {useString('amity_social_status_event_feed_upcoming')}
          </Typography.TitleBold>
          <EventList
            {...upcomingEventCollection}
            hasMore={false}
            items={upcomingEventCollection.items.slice(0, 5)}
          />
          {upcomingEventCollection.items.length >= 5 && (
            <Button
              variant="outlined"
              color="secondary"
              onPress={() =>
                AmityMyEventFeedComponentBehavior?.goToUpcomingEventsPage?.({ fromExplore: false })
              }
            >
              {useString('amity_social_button_view_all')}
            </Button>
          )}
        </div>
      )}
      {pastEventCollection.isLoadingFirstPage ? (
        <Skeleton className={styles.myEvents__section}>
          <Skeleton.Line width="8.75rem" height="0.75rem" />
          <EventListSkeleton />
        </Skeleton>
      ) : (
        <div className={styles.myEvents__section}>
          <Typography.TitleBold className={styles.myEvents__sectionTitle}>
            {useString('amity_social_button_event_feed_past')}
          </Typography.TitleBold>
          <EventList
            {...pastEventCollection}
            hasMore={false}
            items={pastEventCollection.items.slice(0, 5)}
          />
          {pastEventCollection.items.length >= 5 && (
            <Button
              variant="outlined"
              color="secondary"
              onPress={AmityMyEventFeedComponentBehavior?.goToPastEventsPage}
            >
              {useString('amity_social_button_view_all')}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
