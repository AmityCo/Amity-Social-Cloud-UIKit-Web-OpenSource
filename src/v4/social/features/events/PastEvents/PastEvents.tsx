import { BackButton } from '~/v4/social/elements';
import { usePastEvents } from './hooks/usePastEvents';
import { Tabs, Typography } from '~/v4/core/components';
import { EventList } from '~/v4/social/features/events/components/EventList';
import styles from './PastEvents.module.css';

export function PastEvents() {
  const {
    onBack,
    activeTab,
    themeStyles,
    setActiveTab,
    isVisitorOrBot,
    eventCollection,
    accessibilityId,
    PastEventsTab,
    hasCreateEventPermission,
  } = usePastEvents();

  const renderEventList = () => (
    <div className={styles.pastEvents__list}>
      <EventList {...eventCollection} />
    </div>
  );

  return (
    <section className={styles.pastEvents} style={themeStyles} data-testid={accessibilityId}>
      <div
        className={styles.pastEvents__header}
        data-has-tabs={!isVisitorOrBot && hasCreateEventPermission}
      >
        <BackButton onPress={() => onBack()} />
        <Typography.Headline className={styles.pastEvents__headerTitle}>
          Past events
        </Typography.Headline>
        <div className={styles.pastEvents__headerActions} />
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
              label: 'All',
              value: PastEventsTab.All,
              content: renderEventList,
            },
            {
              label: 'Hosting',
              value: PastEventsTab.Hosting,
              content: renderEventList,
            },
          ]}
        />
      )}
    </section>
  );
}
