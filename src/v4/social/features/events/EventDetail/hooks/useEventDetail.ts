import { Key } from 'react-aria';
import { FileRepository } from '@amityco/ts-sdk';
import { TabsRef } from '~/v4/core/components/Tabs';
import { useEffect, useRef, useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { useEvent } from '~/v4/social/features/events/hooks';

enum EventDetailTab {
  About = 'about',
  Discussion = 'discussion',
}

export function useEventDetail(eventId: string) {
  const pageId = PAGE_ID.EVENT_DETAIL_PAGE;

  const tabRef = useRef<TabsRef>(null);
  const eventCoverRef = useRef<HTMLDivElement | null>(null);
  const { accessibilityId, themeStyles } = useAmityPage({ pageId });

  const [isBackgroundShown, setIsBackgroundShown] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { event, isLoading } = useEvent({ eventId });
  const [activeTab, setActiveTab] = useState<Key>(EventDetailTab.About);

  const actionBackground: React.CSSProperties = {
    background: isBackgroundShown
      ? event?.coverImage?.fileUrl
        ? `url(${FileRepository.fileUrlWithSize(event?.coverImage?.fileUrl, 'medium')}) center/cover no-repeat`
        : 'linear-gradient(188deg, #A5A9B5 6.23%, #898E9E 93.77%)'
      : 'transparent',
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setSticky(!entry.isIntersecting), {
      threshold: 1,
    });

    if (tabRef?.current?.tabListRef) observer.observe(tabRef.current?.tabListRef);
    return () => observer.disconnect();
  }, [tabRef?.current]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsBackgroundShown(!entry.isIntersecting),
      {
        threshold: 0.25,
      },
    );

    if (eventCoverRef?.current) observer.observe(eventCoverRef.current);
    return () => observer.disconnect();
  }, [eventCoverRef?.current]);

  return {
    event,
    pageId,
    tabRef,
    sticky,
    isLoading,
    activeTab,
    themeStyles,
    setActiveTab,
    EventDetailTab,
    eventCoverRef,
    accessibilityId,
    actionBackground,
    isBackgroundShown,
  };
}
