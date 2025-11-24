import { BackButton } from '~/v4/social/elements';
import { Tabs, Typography } from '~/v4/core/components';
import { useUpcomingEvents } from './hooks/useUpcomingEvents';
import { EventList } from '~/v4/social/features/events/components/EventList';
import styles from './UpcomingEvents.module.css';

export type UpcomingEventsProps = {
  fromExplore?: boolean;
};

export function UpcomingEvents({ fromExplore }: UpcomingEventsProps) {
  const {
    onBack,
    activeTab,
    themeStyles,
    setActiveTab,
    isVisitorOrBot,
    eventCollection,
    accessibilityId,
    UpcomingEventsTab,
    hasCreateEventPermission,
  } = useUpcomingEvents({ fromExplore });

  const renderEventList = () => (
    <div className={styles.upcomingEvents__list}>
      <EventList {...eventCollection} />
    </div>
  );

  return (
    <section className={styles.upcomingEvents} style={themeStyles} data-testid={accessibilityId}>
      <div
        className={styles.upcomingEvents__header}
        data-has-tabs={!isVisitorOrBot && hasCreateEventPermission}
      >
        <BackButton onPress={() => onBack()} />
        <Typography.Headline className={styles.upcomingEvents__headerTitle}>
          Upcoming events
        </Typography.Headline>
        <div className={styles.upcomingEvents__headerActions} />
      </div>
      {isVisitorOrBot || !hasCreateEventPermission ? (
        renderEventList()
      ) : (
        <Tabs
          value={activeTab}
          variant="underlined"
          onChange={setActiveTab}
          tabs={[
            {
              value: UpcomingEventsTab.All,
              label: 'All',
              content: renderEventList,
            },
            {
              value: UpcomingEventsTab.Hosting,
              label: 'Hosting',
              content: renderEventList,
            },
          ]}
        />
      )}
    </section>
  );
}
