import React, { forwardRef } from 'react';
import { Pin as PinIcon } from '~/v4/icons/Pin';
import { Button } from '~/v4/core/natives/Button';
import { Feed as FeedIcon } from '~/v4/icons/Feed';
import { Image as ImageIcon } from '~/v4/icons/Image';
import { Video as VideoIcon } from '~/v4/icons/Video';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';
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

    if (isExcluded) return null;

    return (
      <nav
        ref={ref}
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.communityTabs__container}
      >
        <Button
          aria-label="Community Feed"
          className={styles.communityTabs__tab}
          data-testid={`${accessibilityId}_feed`}
          data-is-active={activeTab === 'community_feed'}
          onPress={() => onTabChange('community_feed')}
        >
          <FeedIcon className={styles.communityTabs__icon} />
        </Button>
        <Button
          aria-label="Community Pin Posts"
          className={styles.communityTabs__tab}
          data-testid={`${accessibilityId}_pin`}
          data-is-active={activeTab === 'community_pin'}
          onPress={() => onTabChange('community_pin')}
        >
          <PinIcon className={styles.communityTabs__pinIcon} />
        </Button>
        <Button
          aria-label="Community Image Gallery"
          className={styles.communityTabs__tab}
          data-testid={`${accessibilityId}_image_feed`}
          data-is-active={activeTab === 'community_image_feed'}
          onPress={() => onTabChange('community_image_feed')}
        >
          <ImageIcon className={styles.communityTabs__icon} />
        </Button>
        <Button
          aria-label="Community Video Gallery"
          className={styles.communityTabs__tab}
          data-testid={`${accessibilityId}_video_feed`}
          data-is-active={activeTab === 'community_video_feed'}
          onPress={() => onTabChange('community_video_feed')}
        >
          <VideoIcon className={styles.communityTabs__icon} />
        </Button>
      </nav>
    );
  },
);
