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
  const { event, pageId, activeTab, themeStyles, setActiveTab, EventDetailTab, accessibilityId } =
    useEventDetail(eventId);

  if (!event) return null;

  return (
    <section className={styles.eventDetail} data-testid={accessibilityId} style={themeStyles}>
      <div className={styles.eventDetail__header}>
        <EventActions event={event} />
        <EventCover url={event.coverImage?.fileUrl} />
        <EventDescription event={event} />
        <RSVPButton event={event} />
        <Tabs
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
