import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';

/**
 * Which social home tabs this build shows, in order.
 *
 * One id per tab, because these are the ids the module tables own: Feed owns
 * For You and Newsfeed, Community the Communities tab, Events the Events tab
 * and Clip the Clips tab. Each chip already gates itself, so the row came out
 * right — but the *selection* did not. Feed off removed both feed tabs and the
 * page still opened on one of them: a tab with no button, whose body never
 * draws.
 *
 * Sibling of `useCommunityProfileTabs`. Read it inside the page, never above:
 * `SocialHomePage` is the component that calls `useAmityPage`, and outside that
 * the config is read once before it has loaded and never again.
 */
export const useSocialHomeTabs = (pageId: string = PAGE_ID.SOCIAL_HOME_PAGE) => {
  const forYou = useAmityElement({
    pageId,
    componentId: '*',
    elementId: ELEMENT_ID.FOR_YOU_BUTTON,
  });
  const newsfeed = useAmityElement({
    pageId,
    componentId: '*',
    elementId: ELEMENT_ID.NEWSFEED_BUTTON,
  });
  const communities = useAmityElement({
    pageId,
    componentId: '*',
    elementId: ELEMENT_ID.COMMUNITIES_BUTTON,
  });
  const events = useAmityElement({ pageId, componentId: '*', elementId: ELEMENT_ID.EVENTS_BUTTON });
  const clips = useAmityElement({
    pageId,
    componentId: '*',
    elementId: ELEMENT_ID.CLIPSFEED_BUTTON,
  });

  const excluded: Partial<Record<HomePageTab, boolean>> = {
    [HomePageTab.ForYou]: forYou.isExcluded,
    [HomePageTab.Newsfeed]: newsfeed.isExcluded,
    [HomePageTab.Communities]: communities.isExcluded,
    [HomePageTab.Events]: events.isExcluded,
    [HomePageTab.Clips]: clips.isExcluded,
  };

  // Reading order, which is also the landing order: the customer lands on the
  // first tab that survived. With Feed off that is Communities, which is what
  // the product decided a feed-less build should open on.
  const ORDER = [
    HomePageTab.ForYou,
    HomePageTab.Newsfeed,
    HomePageTab.Communities,
    HomePageTab.Events,
    HomePageTab.Clips,
  ];

  const visible = ORDER.filter((tab) => !excluded[tab]);

  return {
    visible,
    /** The first surviving tab, or null when a build has none of them. */
    first: visible[0] ?? null,
    isVisible: (tab: HomePageTab) => !excluded[tab],
  };
};
