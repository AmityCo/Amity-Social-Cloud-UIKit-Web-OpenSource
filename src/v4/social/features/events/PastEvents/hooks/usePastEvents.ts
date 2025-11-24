import { Key } from 'react-aria';
import { useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { AmityEventOrderOption, AmityEventStatus } from '@amityco/ts-sdk';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useEventsCollection, useEventPermission } from '~/v4/social/features/events/hooks';

enum PastEventsTab {
  All = 'All',
  Hosting = 'Hosting',
}

export function usePastEvents() {
  const pageId = PAGE_ID.PAST_EVENTS_PAGE;

  const { onBack } = useNavigation();
  const { isVisitorOrBot, currentUserId } = useSDK();
  const { hasCreateEventPermission } = useEventPermission();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const [activeTab, setActiveTab] = useState<Key>(PastEventsTab.All);

  const eventCollection = useEventsCollection({
    limit: 10,
    userId: currentUserId!,
    shouldCall: !!currentUserId,
    status: AmityEventStatus.Ended,
    onlyAttendee: activeTab === PastEventsTab.All,
    orderBy: AmityEventOrderOption.Descending,
  });

  return {
    pageId,
    onBack,
    activeTab,
    themeStyles,
    setActiveTab,
    PastEventsTab,
    isVisitorOrBot,
    eventCollection,
    accessibilityId,
    hasCreateEventPermission,
  };
}
