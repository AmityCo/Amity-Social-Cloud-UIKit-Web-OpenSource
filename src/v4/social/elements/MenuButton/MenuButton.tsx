import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './MenuButton.module.css';

const EllipsisH = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="4"
    viewBox="0 0 16 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9.6875 2.25C9.6875 3.19922 8.91406 3.9375 8 3.9375C7.05078 3.9375 6.3125 3.19922 6.3125 2.25C6.3125 1.33594 7.05078 0.5625 8 0.5625C8.91406 0.5625 9.6875 1.33594 9.6875 2.25ZM13.9062 0.5625C14.8203 0.5625 15.5938 1.33594 15.5938 2.25C15.5938 3.19922 14.8203 3.9375 13.9062 3.9375C12.957 3.9375 12.2188 3.19922 12.2188 2.25C12.2188 1.33594 12.957 0.5625 13.9062 0.5625ZM2.09375 0.5625C3.00781 0.5625 3.78125 1.33594 3.78125 2.25C3.78125 3.19922 3.00781 3.9375 2.09375 3.9375C1.14453 3.9375 0.40625 3.19922 0.40625 2.25C0.40625 1.33594 1.14453 0.5625 2.09375 0.5625Z" />
  </svg>
);

export interface MenuButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export function MenuButton({ pageId = '*', componentId = '*', onClick }: MenuButtonProps) {
  const elementId = 'menu_button';
  const { isExcluded, accessibilityId, themeStyles, config, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div onClick={onClick} data-qa-anchor={accessibilityId}>
      <IconComponent
        defaultIcon={() => <EllipsisH className={styles.menuButton} style={themeStyles} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </div>
  );
}
