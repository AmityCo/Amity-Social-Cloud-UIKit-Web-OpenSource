import Event from '~/v4/icons/Events';
import { useEventDetail } from './hooks';
import { Tabs } from '~/v4/core/components';
import { Discussion } from '~/v4/icons/Discussion';
import {
  EventActions,
  EventCover,
  EventDescription,
  EventDiscussion,
  EventInfo,
  RSVPButton,
} from './components';
import styles from './EventDetail.module.css';

export type EventDetailProps = {
  eventId: string;
};

export function EventDetail({ eventId }: EventDetailProps) {
  const {
    event,
    pageId,
    sticky,
    tabRef,
    activeTab,
    themeStyles,
    setActiveTab,
    eventCoverRef,
    EventDetailTab,
    accessibilityId,
    actionBackground,
    isBackgroundShown,
  } = useEventDetail(eventId);

  if (!event) return null;

  return (
    <section style={themeStyles} data-testid={accessibilityId} className={styles.eventDetail}>
      <div className={styles.eventDetail__header}>
        <div className={styles.eventDetail__topBar} style={actionBackground}>
          <EventActions event={event} withTitle={isBackgroundShown} />
          {sticky && (
            <Tabs
              ref={tabRef}
              variant="icon"
              value={activeTab}
              onChange={setActiveTab}
              tabs={[
                {
                  value: EventDetailTab.About,
                  label: Event,
                  content: () => null,
                },
                {
                  value: EventDetailTab.Discussion,
                  label: Discussion,
                  content: () => null,
                },
              ]}
            />
          )}
        </div>
        <EventCover url={event.coverImage?.fileUrl} ref={eventCoverRef} />
        <EventDescription event={event} />
        <RSVPButton event={event} />
        <Tabs
          ref={tabRef}
          variant="icon"
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              value: EventDetailTab.About,
              label: Event,
              content: () => <EventInfo pageId={pageId} event={event} />,
            },
            {
              value: EventDetailTab.Discussion,
              label: Discussion,
              content: () => <EventDiscussion pageId={pageId} event={event} />,
            },
          ]}
        />
      </div>
    </section>
  );
}
