import clsx from 'clsx';
import { createElement, forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import styles from './MentionMenuTabs.module.css';

type Key = string | number;

type BaseTab = {
  value: Key;
  accessibilityId?: string;
  content: () => ReactNode;
};

type TextTab = BaseTab & {
  label: string;
};

type IconTab = BaseTab & {
  label: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

type MentionMenuTabsProps = {
  value: Key;
  className?: string;
  labelClassName?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  onChange: (key: Key) => void;
  'aria-label'?: string;
} & (
  | {
      variant?: 'underlined' | 'chip';
      tabs: TextTab[];
    }
  | {
      variant?: 'icon' | 'iconSmall';
      tabs: IconTab[];
    }
);

export type MentionMenuTabsRef = {
  tabListRef: HTMLDivElement | null;
  tabRef: HTMLDivElement | null;
};

export const MentionMenuTabs = forwardRef<MentionMenuTabsRef, MentionMenuTabsProps>(
  (
    {
      tabs,
      value,
      onChange,
      className,
      labelClassName,
      tabListClassName,
      tabPanelClassName,
      variant = 'iconSmall',
      ...props
    }: MentionMenuTabsProps,
    ref,
  ) => {
    const tabListRef = useRef<HTMLDivElement | null>(null);
    const tabRef = useRef<HTMLDivElement | null>(null);
    const [hoveredTab, setHoveredTab] = useState<Key | null>(null);

    useImperativeHandle(ref, () => ({
      tabListRef: tabListRef.current,
      tabRef: tabRef.current,
    }));

    const activeTab = (tabs as BaseTab[]).find((tab) => tab.value === value);
    const isIconVariant = variant === 'icon' || variant === 'iconSmall';

    return (
      <div ref={tabRef} className={clsx(styles.tabs, className)}>
        <div
          ref={tabListRef}
          role="tablist"
          data-variant={variant}
          aria-label={props['aria-label']}
          className={clsx(styles.tabList, tabListClassName)}
        >
          {tabs.map((tab) => (
            <div
              key={tab.value}
              role="tab"
              tabIndex={0}
              className={styles.tab}
              data-variant={variant}
              data-testid={tab.accessibilityId}
              data-selected={tab.value === value ? true : undefined}
              data-hovered={hoveredTab === tab.value ? true : undefined}
              aria-selected={tab.value === value}
              onMouseEnter={() => setHoveredTab(tab.value)}
              onMouseLeave={() => setHoveredTab(null)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange(tab.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(tab.value);
                }
              }}
            >
              {isIconVariant ? (
                createElement((tab as IconTab).label, {
                  className: styles.tabIcon,
                  'data-variant': variant,
                } as React.SVGProps<SVGSVGElement>)
              ) : (
                <Typography.BodyBold className={labelClassName}>
                  {(tab as TextTab).label}
                </Typography.BodyBold>
              )}
            </div>
          ))}
        </div>
        <div role="tabpanel" className={clsx(styles.tabPanel, tabPanelClassName)}>
          {activeTab?.content()}
        </div>
      </div>
    );
  },
);
