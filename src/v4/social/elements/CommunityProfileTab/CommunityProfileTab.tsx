import { forwardRef } from 'react';
import MediaIcon from '~/v4/icons/Media';
import EventIcon from '~/v4/icons/Events';
import { Pin as PinIcon } from '~/v4/icons/Pin';
import { Button } from '~/v4/core/natives/Button';
import { Feed as FeedIcon } from '~/v4/icons/Feed';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';
import { useCommunityProfileTabs } from '~/v4/social/hooks/useCommunityProfileTabs';
import styles from './CommunityProfileTab.module.css';

type CommunityTabsProps = {
  pageId: string;
  componentId?: string;
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
};

export const CommunityProfileTab = forwardRef<HTMLDivElement, CommunityTabsProps>(
  ({ pageId, activeTab, onTabChange, componentId = '*' }, ref) => {
    const elementId = 'community_profile_tab';

    const { isExcluded, accessibilityId, themeStyles } = useAmityElement({
      pageId,
      componentId,
      elementId,
    });

    // Every tab belongs to a module: the feed tab to Feed, the pinned tab to
    // Community, the events tab to Events, the media tab to Post. Only the row
    // was gated, so Events off and Post off each left their tab on a page
    // Community owns.
    const tabs = useCommunityProfileTabs(pageId, componentId);

    if (isExcluded) return null;
    // A row with no tabs left is not a row — it would draw its own border and
    // spacing over nothing.
    if (tabs.visible.length === 0) return null;

    return (
      <nav
        ref={ref}
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.communityTabs__container}
      >
        {tabs.isVisible('community_feed') ? (
          <Button
            aria-label="Community Feed"
            className={styles.communityTabs__tab}
            data-testid={`${accessibilityId}_feed`}
            data-is-active={activeTab === 'community_feed'}
            onPress={() => onTabChange('community_feed')}
          >
            <FeedIcon className={styles.communityTabs__icon} />
          </Button>
        ) : null}
        {tabs.isVisible('community_pin') ? (
          <Button
            aria-label="Community Pin Posts"
            className={styles.communityTabs__tab}
            data-testid={`${accessibilityId}_pin`}
            data-is-active={activeTab === 'community_pin'}
            onPress={() => onTabChange('community_pin')}
          >
            <PinIcon className={styles.communityTabs__pinIcon} />
          </Button>
        ) : null}
        {tabs.isVisible('community_event_feed') ? (
          <Button
            aria-label="Community Event Feed"
            className={styles.communityTabs__tab}
            data-testid={`${accessibilityId}_event_feed`}
            data-is-active={activeTab === 'community_event_feed'}
            onPress={() => onTabChange('community_event_feed')}
          >
            <EventIcon className={styles.communityTabs__icon} />
          </Button>
        ) : null}
        {tabs.isVisible('community_media_feed') ? (
          <Button
            aria-label="Community Media Feed"
            className={styles.communityTabs__tab}
            data-testid={`${accessibilityId}_media_feed`}
            data-is-active={activeTab === 'community_media_feed'}
            onPress={() => onTabChange('community_media_feed')}
          >
            <MediaIcon className={styles.communityTabs__icon} />
          </Button>
        ) : null}
      </nav>
    );
  },
);
