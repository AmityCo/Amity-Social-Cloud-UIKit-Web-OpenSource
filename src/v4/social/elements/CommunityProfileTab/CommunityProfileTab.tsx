import React from 'react';
import styles from './CommunityProfileTab.module.css';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import { Feed as FeedIcon } from '~/v4/icons/Feed';
import { Pin as PinIcon } from '~/v4/icons/Pin';
import { Image as ImageIcon } from '~/v4/icons/Image';
import { Video as VideoIcon } from '~/v4/icons/Video';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';

interface CommunityTabsProps {
  pageId: string;
  componentId?: string;
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

export const CommunityProfileTab: React.FC<CommunityTabsProps> = ({
  pageId,
  componentId = '*',
  activeTab,
  onTabChange,
}) => {
  const elementId = 'community_profile_tab';

  const { isExcluded, accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.communityTabs__container}
    >
      <Button
        data-testid={`${accessibilityId}_feed`}
        data-is-active={activeTab === 'community_feed'}
        onPress={() => onTabChange('community_feed')}
        className={styles.communityTabs__tab}
      >
        <FeedIcon className={styles.communityTabs__icon} />
      </Button>
      <Button
        data-testid={`${accessibilityId}_pin`}
        data-is-active={activeTab === 'community_pin'}
        onPress={() => onTabChange('community_pin')}
        className={styles.communityTabs__tab}
      >
        <PinIcon className={styles.communityTabs__pinIcon} />
      </Button>
      <Button
        data-testid={`${accessibilityId}_image_feed`}
        data-is-active={activeTab === 'community_image_feed'}
        onPress={() => onTabChange('community_image_feed')}
        className={styles.communityTabs__tab}
      >
        <ImageIcon className={styles.communityTabs__icon} />
      </Button>
      <Button
        data-testid={`${accessibilityId}_video_feed`}
        data-is-active={activeTab === 'community_video_feed'}
        onPress={() => onTabChange('community_video_feed')}
        className={styles.communityTabs__tab}
      >
        <VideoIcon className={styles.communityTabs__icon} />
      </Button>
    </div>
  );
};
