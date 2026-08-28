import { useEffect } from 'react';
import Event from '~/v4/icons/Events';
import { useEventDetail } from './hooks';
import { Tabs } from '~/v4/core/components';
import { Discussion } from '~/v4/icons/Discussion';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { EventCreatedSuccessSheet } from '~/v4/social/elements/EventCreatedSuccessSheet';
import { useRedirectEventPostTargetSelectionPage } from '~/v4/social/features/events/hooks';
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
  showCreatedSuccessSheet?: boolean;
};

// Module-scoped so it survives EventDetail unmount/remount as the nav stack
// pushes/pops the target-selection and composer pages on top of it. Ensures
// the created-success sheet is shown at most once per event.
const shownCreatedSuccessSheetForEvent = new Set<string>();

export function EventDetail({ eventId, pop, showCreatedSuccessSheet }: EventDetailProps) {
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

  const { setDrawerData, removeDrawerData } = useDrawer();
  const { openPopup, closePopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const { redirectEventPostTargetSelectionPage } = useRedirectEventPostTargetSelectionPage();

  useEffect(() => {
    if (!showCreatedSuccessSheet || !event || event.isDeleted) return;
    if (shownCreatedSuccessSheetForEvent.has(event.eventId)) return;
    shownCreatedSuccessSheetForEvent.add(event.eventId);

    const openComposerFromSheet = () => {
      redirectEventPostTargetSelectionPage(event);
    };

    if (isDesktop) {
      openPopup({
        id: 'event-created-success-popup',
        pageId: 'event_detail_page',
        view: 'desktop',
        ariaLabel: 'Event created successfully',
        children: (
          <EventCreatedSuccessSheet
            onPostToFeed={() => {
              closePopup();
              openComposerFromSheet();
            }}
            onDismiss={() => closePopup()}
          />
        ),
      });

      return () => closePopup();
    }

    setDrawerData({
      content: (
        <EventCreatedSuccessSheet
          onPostToFeed={() => {
            removeDrawerData();
            openComposerFromSheet();
          }}
          onDismiss={() => removeDrawerData()}
        />
      ),
    });

    return () => removeDrawerData();
  }, [showCreatedSuccessSheet, event?.eventId, isDesktop]);

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
