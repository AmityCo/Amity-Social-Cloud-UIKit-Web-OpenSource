import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { Typography } from '~/v4/core/components';
import { Tabs, TabList, Tab, TabPanel, Key, TabsProps } from 'react-aria-components';
import styles from './SecondaryTab.module.css';

type TabsBarProps = TabsProps & {
  activeTab: Key;
  labelClassName?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  onChange: (key: Key) => void;
  tabs: { value: string; label: string; accessibilityId?: string; content: () => ReactNode }[];
};

export const SecondaryTab = ({
  tabs,
  onChange,
  activeTab,
  className,
  labelClassName,
  tabListClassName,
  tabPanelClassName,
  ...props
}: TabsBarProps) => {
  return (
    <Tabs
      {...props}
      selectedKey={activeTab}
      onSelectionChange={onChange}
      className={clsx(styles.tabs, className)}
    >
      <TabList aria-label={props['aria-label']} className={clsx(styles.tabsList, tabListClassName)}>
        {tabs.map((tab) => (
          <Tab
            id={tab.value}
            key={tab.value}
            className={styles.tab}
            data-testid={tab.accessibilityId}
          >
            <Typography.CaptionBold className={labelClassName}>{tab.label}</Typography.CaptionBold>
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel
          id={tab.value}
          key={tab.value}
          className={clsx(styles.tabPanel, tabPanelClassName)}
        >
          {tab.content()}
        </TabPanel>
      ))}
    </Tabs>
  );
};
