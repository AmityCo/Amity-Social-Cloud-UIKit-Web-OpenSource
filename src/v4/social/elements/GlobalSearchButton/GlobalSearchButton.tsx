import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './GlobalSearchButton.module.css';

const GlobalSearchSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15.7814 14.3104C16.0627 14.6229 16.0627 15.0917 15.7502 15.3729L14.8752 16.2479C14.5939 16.5604 14.1252 16.5604 13.8127 16.2479L10.7189 13.1542C10.5627 12.9979 10.5002 12.8104 10.5002 12.6229V12.0917C9.37516 12.9667 8.00016 13.4667 6.50016 13.4667C2.90641 13.4667 0.000162125 10.5604 0.000162125 6.96667C0.000162125 3.40417 2.90641 0.466675 6.50016 0.466675C10.0627 0.466675 13.0002 3.40417 13.0002 6.96667C13.0002 8.49792 12.4689 9.87292 11.6252 10.9667H12.1252C12.3127 10.9667 12.5002 11.0604 12.6564 11.1854L15.7814 14.3104ZM6.50016 10.9667C8.68766 10.9667 10.5002 9.18542 10.5002 6.96667C10.5002 4.77917 8.68766 2.96667 6.50016 2.96667C4.28141 2.96667 2.50016 4.77917 2.50016 6.96667C2.50016 9.18542 4.28141 10.9667 6.50016 10.9667Z" />
  </svg>
);

export interface GlobalSearchButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function GlobalSearchButton({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onClick,
}: GlobalSearchButtonProps) {
  const elementId = 'global_search_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => (
        <div
          style={themeStyles}
          className={styles.globalSearchButton}
          onClick={onClick}
          data-qa-anchor={accessibilityId}
        >
          <GlobalSearchSvg className={clsx(styles.globalSearchButton__icon, defaultClassName)} />
        </div>
      )}
      imgIcon={() => (
        <img
          style={themeStyles}
          src={config.icon}
          alt={uiReference}
          className={clsx(styles.globalSearchButton__icon, imgClassName)}
          onClick={onClick}
          data-qa-anchor={accessibilityId}
        />
      )}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
