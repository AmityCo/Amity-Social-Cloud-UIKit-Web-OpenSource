import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { AmityEventStatus } from '@amityco/ts-sdk';
import { Skeleton } from '~/v4/core/components/Skeleton';
import { Button } from '~/v4/core/components/AriaButton';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useEventsCollection } from '~/v4/social/features/events/hooks';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { EventList } from '~/v4/social/features/events/components/EventList';
import { HappeningEvents } from '~/v4/social/features/events/EventHub/components/HappeningEvents';
import EventListSkeleton from '~/v4/social/features/events/components/EventList/EventListSkeleton';
import styles from './Explore.module.css';

type ExploreEventProps = {
  pageId?: string;
};

export function ExploreEvent({ pageId = '*' }: ExploreEventProps) {
  const componentId = COMPONENT_ID.EXPLORE_EVENT;

  const { AmityExploreEventFeedComponentBehavior } = usePageBehavior();

  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const eventCollection = useEventsCollection({
    limit: 10,
    status: AmityEventStatus.Scheduled,
    excludeOwnEvents: true,
  });

  if (isExcluded) return null;

  return (
    <section className={styles.explore} style={themeStyles} data-testid={accessibilityId}>
      <HappeningEvents />
      {eventCollection.isLoadingFirstPage ? (
        <Skeleton className={styles.explore__recommended}>
          <Skeleton.Line width="8.75rem" height="0.75rem" />
          <EventListSkeleton />
        </Skeleton>
      ) : (
        <div className={styles.explore__recommended}>
          <Typography.TitleBold className={styles.explore__recommendedTitle}>
            {useString('amity_social_label_recommended_for_you')}
          </Typography.TitleBold>
          <EventList
            {...eventCollection}
            hasMore={false}
            items={eventCollection.items.slice(0, 5)}
          />
          {eventCollection.items.length >= 5 && (
            <Button
              variant="outlined"
              color="secondary"
              onPress={() =>
                AmityExploreEventFeedComponentBehavior?.goToUpcomingEventsPage?.({
                  fromExplore: true,
                })
              }
            >
              {useString('amity_social_button_view_all')}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
