import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';

/**
 * Which community profile tabs this build shows, in order.
 *
 * One id per tab, because these are the ids the module tables own: Feed owns
 * the feed, pinned and media tabs, and Events the events tab. Gating only the
 * row left the Events and Media tabs standing after their module was switched
 * off, and gating only the tab would have left the body reachable from a link.
 *
 * The pinned tab is Feed's rather than Post's because a pinned list is a feed
 * of posts, and Feed is the stronger owner of the two — the catalog holds Feed
 * off whenever Post is off, so this still hides the tab on a Post-off network
 * as well as a Feed-off one.
 */
export const useCommunityProfileTabs = (pageId: string, componentId = '*') => {
  const feed = useAmityElement({ pageId, componentId, elementId: 'community_feed_tab_button' });
  const pin = useAmityElement({ pageId, componentId, elementId: 'community_pin_tab_button' });
  const event = useAmityElement({ pageId, componentId, elementId: 'event_button' });
  const media = useAmityElement({ pageId, componentId, elementId: 'community_media_tab_button' });

  const excluded: Record<CommunityTab, boolean> = {
    community_feed: feed.isExcluded,
    community_pin: pin.isExcluded,
    community_event_feed: event.isExcluded,
    community_media_feed: media.isExcluded,
  };

  const visible = (Object.keys(excluded) as CommunityTab[]).filter((tab) => !excluded[tab]);

  return {
    visible,
    isVisible: (tab: CommunityTab) => !excluded[tab],
  };
};
