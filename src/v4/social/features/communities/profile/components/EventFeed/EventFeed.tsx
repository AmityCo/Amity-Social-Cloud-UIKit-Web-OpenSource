import { useState } from 'react';
import ChipButton from '~/v4/social/elements/ChipButton';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { useEventsCollection } from '~/v4/social/features/events/hooks';
import { AmityEventOriginType, AmityEventStatus } from '@amityco/ts-sdk';
import { EventList } from '~/v4/social/features/events/components/EventList';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { HappeningEvents } from '~/v4/social/features/events/EventHub/components/HappeningEvents';
import EventListSkeleton from '~/v4/social/features/events/components/EventList/EventListSkeleton';
import styles from './EventFeed.module.css';

type CommunityEventFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityEventFeed = ({ pageId = '*', communityId }: CommunityEventFeedProps) => {
  const componentId = COMPONENT_ID.COMMUNITY_EVENT_FEED;
  const [eventTab, setEventTab] = useState<AmityEventStatus>(AmityEventStatus.Scheduled);
  const { community } = useCommunity({ communityId, shouldCall: !!communityId });

  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const eventCollection = useEventsCollection({
    limit: 20,
    status: eventTab,
    originId: communityId,
    originType: AmityEventOriginType.Community,
  });

  if (isExcluded) return null;

  if (!community?.isJoined && !community?.isPublic)
    return (
      <section className={styles.eventFeed} data-testid="community-media-feed">
        <LockPrivateContent />
      </section>
    );

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.eventFeed}>
      <HappeningEvents originId={communityId} originType={AmityEventOriginType.Community} />
      <section className={styles.eventFeed__events}>
        <div className={styles.eventFeed__eventsTabs}>
          <ChipButton
            variant="body"
            label="Upcoming"
            isTransparent={false}
            isActive={eventTab === AmityEventStatus.Scheduled}
            onPress={() => setEventTab(AmityEventStatus.Scheduled)}
          />
          <ChipButton
            label="Past"
            variant="body"
            isTransparent={false}
            isActive={eventTab === AmityEventStatus.Ended}
            onPress={() => setEventTab(AmityEventStatus.Ended)}
          />
        </div>
        {eventCollection.isLoadingFirstPage ? (
          <EventListSkeleton />
        ) : (
          <EventList {...eventCollection} />
        )}
      </section>
    </div>
  );
};
