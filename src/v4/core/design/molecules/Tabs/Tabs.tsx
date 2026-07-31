import clsx from 'clsx';
import { type ReactNode } from 'react';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  type Key,
} from 'react-aria-components';
import { Tab } from '~/v4/core/design/atoms/Tab';
import styles from './Tabs.module.css';

export type TabsVariant = 'pill' | 'underlined' | 'icon';

export type TabItem = {
  value: Key;
  label?: ReactNode;
  icon?: ReactNode;
  content?: () => ReactNode;
  isDisabled?: boolean;
  'aria-label'?: string;
};

export type TabsProps = {
  variant?: TabsVariant;
  value: Key;
  onChange: (value: Key) => void;
  tabs: TabItem[];
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  'aria-label'?: string;
};

export function Tabs({
  variant = 'pill',
  value,
  onChange,
  tabs,
  className,
  tabListClassName,
  tabPanelClassName,
  ...props
}: TabsProps) {
  return (
    <AriaTabs
      selectedKey={value}
      onSelectionChange={onChange}
      className={clsx(styles.tabs, className)}
    >
      <AriaTabList
        aria-label={props['aria-label']}
        data-variant={variant}
        className={clsx(styles.tabList, tabListClassName)}
      >
        {tabs.map((tab) => {
          const common = { id: tab.value, isDisabled: tab.isDisabled };
          if (variant === 'icon') {
            return (
              <Tab.Icon
                key={String(tab.value)}
                {...common}
                icon={tab.icon}
                aria-label={tab['aria-label'] ?? ''}
              />
            );
          }
          if (variant === 'underlined') {
            return <Tab.Underlined key={String(tab.value)} {...common} label={tab.label ?? ''} />;
          }
          return <Tab.Pill key={String(tab.value)} {...common} label={tab.label ?? ''} />;
        })}
      </AriaTabList>
      {tabs.map((tab) =>
        tab.content ? (
          <AriaTabPanel
            key={String(tab.value)}
            id={String(tab.value)}
            className={tabPanelClassName}
          >
            {tab.content()}
          </AriaTabPanel>
        ) : null,
      )}
    </AriaTabs>
  );
}
