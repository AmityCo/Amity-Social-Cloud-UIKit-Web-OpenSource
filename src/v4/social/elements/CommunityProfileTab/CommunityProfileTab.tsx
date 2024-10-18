import React from 'react';
import styles from './CommunityProfileTab.module.css';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import { Feed as FeedIcon } from '~/v4/icons/Feed';
import { Pin as PinIcon } from '~/v4/icons/Pin';

interface CommunityTabsProps {
  pageId: string;
  componentId?: string;
  activeTab: 'community_feed' | 'community_pin';
  onTabChange: (tab: 'community_feed' | 'community_pin') => void;
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
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.communityTabs__container}
    >
      <Button
        data-qa-anchor={`${accessibilityId}_feed`}
        data-is-active={activeTab === 'community_feed'}
        onPress={() => onTabChange('community_feed')}
        className={styles.communityTabs__tab}
      >
        <FeedIcon />
      </Button>
      <Button
        data-qa-anchor={`${accessibilityId}_pin`}
        data-is-active={activeTab === 'community_pin'}
        onPress={() => onTabChange('community_pin')}
        className={styles.communityTabs__tab}
      >
        <PinIcon />
      </Button>
      {/* <Button
        data-qa-anchor={`${accessibilityId}_photo`}
        data-is-active={activeTab === 'community_pin'}
        onPress={() => onTabChange('community_pin')}
        className={styles.communityTabs__tab}
      >
        <PinIcon />
      </Button>
      <Button
        data-qa-anchor={`${accessibilityId}_video`}
        data-is-active={activeTab === 'community_pin'}
        onPress={() => onTabChange('community_pin')}
        className={styles.communityTabs__tab}
      >
        <PinIcon />
      </Button> */}
    </div>
  );
};
