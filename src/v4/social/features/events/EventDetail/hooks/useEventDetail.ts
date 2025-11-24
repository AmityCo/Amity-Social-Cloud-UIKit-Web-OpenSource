import { useState } from 'react';
import { Key } from 'react-aria';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { useEvent } from '~/v4/social/features/events/hooks';

enum EventDetailTab {
  About = 'about',
  Discussion = 'discussion',
}

export function useEventDetail(eventId: string) {
  const pageId = PAGE_ID.EVENT_DETAIL_PAGE;
  const { event, isLoading } = useEvent({ eventId });
  const [activeTab, setActiveTab] = useState<Key>(EventDetailTab.About);
  const { accessibilityId, themeStyles } = useAmityPage({
    pageId,
  });

  return {
    event,
    pageId,
    isLoading,
    activeTab,
    themeStyles,
    setActiveTab,
    EventDetailTab,
    accessibilityId,
  };
}
