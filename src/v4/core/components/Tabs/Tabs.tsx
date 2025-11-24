import clsx from 'clsx';
import { createElement, ReactNode } from 'react';
import { Typography } from '~/v4/core/components';
import {
  Tab,
  Key,
  TabList,
  TabPanel,
  Tabs as $Tabs,
  TabsProps as $TabsProps,
} from 'react-aria-components';
import styles from './Tabs.module.css';

type TabsProps = ($TabsProps & {
  value: Key;
  labelClassName?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  onChange: (key: Key) => void;
}) &
  (
    | {
        variant: 'underlined' | 'chip';
        tabs: {
          value: Key;
          label: string;
          accessibilityId?: string;
          content: () => ReactNode;
        }[];
      }
    | {
        variant: 'icon';
        tabs: {
          value: Key;
          content: () => ReactNode;
          accessibilityId?: string;
          label: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
        }[];
      }
  );

export const Tabs = ({
  tabs,
  value,
  onChange,
  className,
  labelClassName,
  tabListClassName,
  tabPanelClassName,
  variant = 'underlined',
  ...props
}: TabsProps) => {
  return (
    <$Tabs
      {...props}
      selectedKey={value}
      onSelectionChange={onChange}
      className={clsx(styles.tabs, className)}
    >
      <TabList
        data-variant={variant}
        aria-label={props['aria-label']}
        className={clsx(styles.tabList, tabListClassName)}
      >
        {tabs.map((tab) => (
          <Tab
            id={tab.value}
            key={tab.value}
            className={styles.tab}
            data-variant={variant}
            data-testid={tab.accessibilityId}
          >
            {variant === 'icon' ? (
              createElement(tab.label, { className: styles.tabIcon })
            ) : (
              <Typography.BodyBold className={labelClassName}>{tab.label}</Typography.BodyBold>
            )}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel
          key={tab.value}
          id={tab.value?.toString()}
          className={clsx(styles.tabPanel, tabPanelClassName)}
        >
          {tab.content()}
        </TabPanel>
      ))}
    </$Tabs>
  );
};
