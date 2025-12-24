import { Key } from 'react-aria';
import { useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { AmityEventStatus } from '@amityco/ts-sdk';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UpcomingEventsProps } from '~/v4/social/features/events/UpcomingEvents';
import { useEventsCollection, useEventPermission } from '~/v4/social/features/events/hooks';

enum UpcomingEventsTab {
  All = 'All',
  Hosting = 'Hosting',
}

export function useUpcomingEvents({ fromExplore }: UpcomingEventsProps) {
  const pageId = PAGE_ID.UPCOMING_EVENTS_PAGE;

  const { onBack } = useNavigation();
  const { isVisitorOrBot, currentUserId } = useSDK();
  const { hasCreateEventPermission } = useEventPermission();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const [activeTab, setActiveTab] = useState<Key>(UpcomingEventsTab.All);

  const eventCollection = useEventsCollection({
    limit: 10,
    shouldCall: !!currentUserId,
    status: AmityEventStatus.Scheduled,
    userId: fromExplore && activeTab === UpcomingEventsTab.All ? undefined : currentUserId!,
    onlyAttendee:
      fromExplore && activeTab === UpcomingEventsTab.All
        ? undefined
        : activeTab === UpcomingEventsTab.All,
  });

  return {
    pageId,
    onBack,
    activeTab,
    themeStyles,
    setActiveTab,
    isVisitorOrBot,
    eventCollection,
    accessibilityId,
    UpcomingEventsTab,
    hasCreateEventPermission,
  };
}
