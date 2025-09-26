import React from 'react';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { TabType } from '~/v4/social/constants/videoTabs';
import styles from './TabButton.module.css';

type TabButtonProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  tab: {
    type: string;
  };
};

export const TabButton = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  tab,
  activeTab,
  setActiveTab,
}: TabButtonProps) => {
  const { accessibilityId, config, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Button
      style={themeStyles}
      id={elementId}
      key={tab.type}
      variant="text"
      className={styles.tabButton__tabsButton}
      onPress={() => setActiveTab(tab.type as TabType)}
      data-testid={accessibilityId}
      data-active={activeTab === tab.type}
    >
      <Typography.Body
        className={styles.tabButton__tabsButtonlabel}
        data-active={activeTab === tab.type}
      >
        {config.text}
      </Typography.Body>
    </Button>
  );
};
