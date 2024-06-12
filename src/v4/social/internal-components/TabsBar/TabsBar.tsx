import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Typography } from '~/v4/core/components';
import styles from './TabsBar.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface TabsBarProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  tabs: { value: string; label: string; content: () => ReactNode }[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export const TabsBar = ({
  tabs,
  activeTab,
  onTabChange,
  pageId = '*',
  componentId = '*',
  elementId = '*',
}: TabsBarProps) => {
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  return (
    <Tabs.Root
      style={themeStyles}
      className={styles.tabsRoot}
      value={activeTab}
      onValueChange={(newValue) => onTabChange(newValue)}
    >
      <Tabs.List className={styles.tabsList}>
        {tabs.map((tab) => (
          <Tabs.Trigger value={tab.value} className={styles.tabsTrigger}>
            <Typography.Title>{tab.label}</Typography.Title>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content value={tab.value}>{tab.content()}</Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabsBar;
