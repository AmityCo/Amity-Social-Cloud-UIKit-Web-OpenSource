import Event from '~/v4/icons/Events';
import { useEventDetail } from './hooks';
import { Tabs } from '~/v4/core/components';
import { Discussion } from '~/v4/icons/Discussion';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
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
  pop?: number;
};

export function EventDetail({ eventId, pop }: EventDetailProps) {
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
    myRSVP,
    setMyRSVP,
    refresh,
  } = useEventDetail(eventId);

  if (!event || event.isDeleted) return <FailedToShow />;

  return (
    <section style={themeStyles} data-testid={accessibilityId} className={styles.eventDetail}>
      <div className={styles.eventDetail__header}>
        <div className={styles.eventDetail__topBar} style={actionBackground}>
          <EventActions event={event} myRSVP={myRSVP} withTitle={isBackgroundShown} pop={pop} />
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
        <RSVPButton event={event} myRSVP={myRSVP} setMyRSVP={setMyRSVP} onRefresh={refresh} />
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
