import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CommunityOfficialBadge.module.css';

const OfficialBadgeIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_13767_12214)">
      <path
        d="M11.8976 17.8359L11.8996 17.834L12.8484 16.8852H14.193C14.9566 16.8852 15.6709 16.7038 16.1865 16.1882C16.7021 15.6726 16.8834 14.9584 16.8834 14.1947V12.8495L17.8322 11.8944C18.3738 11.3562 18.7497 10.7241 18.7483 9.99595C18.7469 9.26847 18.3691 8.63729 17.8322 8.1004L16.8834 7.15163V5.807C16.8834 5.04338 16.7021 4.3291 16.1865 3.81351C15.6709 3.29792 14.9566 3.11655 14.193 3.11655H12.8484L11.8996 2.16778C11.3594 1.62759 10.7254 1.2486 9.99508 1.25C9.26539 1.2514 8.63414 1.63213 8.09768 2.17571L7.15052 3.11655H5.80526C5.04577 3.11655 4.33044 3.29244 3.81321 3.80685C3.29521 4.32205 3.11481 5.03849 3.11481 5.807V7.15163L2.16803 8.09842C2.16771 8.09874 2.16738 8.09907 2.16706 8.09939C1.62494 8.63777 1.2486 9.27023 1.25 9.99883C1.2514 10.7259 1.62869 11.3567 2.16506 11.8934C2.16539 11.8937 2.16571 11.8941 2.16604 11.8944L3.11481 12.8495V14.1947C3.11481 14.9584 3.29618 15.6726 3.81177 16.1882C4.32736 16.7038 5.04164 16.8852 5.80526 16.8852H7.14989L8.09668 17.832C8.09701 17.8323 8.09734 17.8326 8.09767 17.833C8.63623 18.3753 9.26867 18.7514 9.99796 18.75C10.7254 18.7486 11.3578 18.3718 11.8976 17.8359ZM12.7177 16.8852C12.7178 16.8852 12.718 16.8852 12.7185 16.8852C12.718 16.8852 12.7177 16.8852 12.7177 16.8852ZM12.9428 3.21103L12.9426 3.2108C12.9427 3.21088 12.9428 3.21096 12.9429 3.21103L12.7185 3.43534L12.9428 3.21103ZM3.20929 7.05715L3.20909 7.05736C3.20916 7.05729 3.20923 7.05722 3.20929 7.05715L3.4336 7.28146L3.20929 7.05715Z"
        className={styles.communityOfficialBadge__border}
        strokeWidth="1.5"
      />
      <path
        d="M8.25311 13.3107C8.40612 13.4707 8.60086 13.5611 8.84429 13.5611C9.10162 13.5611 9.31027 13.4707 9.47024 13.262L13.372 7.78844C13.4763 7.64238 13.532 7.46851 13.532 7.32941C13.532 6.92602 13.2259 6.62695 12.7947 6.62695C12.5165 6.62695 12.3357 6.72432 12.1688 6.96079L8.81647 11.7458L7.14031 9.87494C6.9873 9.70802 6.81343 9.63152 6.57696 9.63152C6.14575 9.63152 5.84668 9.93058 5.84668 10.3479C5.84668 10.5218 5.90928 10.6956 6.02751 10.8208L8.25311 13.3107Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_13767_12214">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export interface CommunityOfficialBadgeProps {
  pageId?: string;
  className?: string;
  componentId?: string;
}

export function CommunityOfficialBadge({
  className,
  pageId = '*',
  componentId = '*',
}: CommunityOfficialBadgeProps) {
  const elementId = 'community_official_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
      defaultIcon={() => (
        <OfficialBadgeIconSvg
          style={themeStyles}
          data-testid={accessibilityId}
          className={clsx(styles.communityOfficialBadge, className)}
        />
      )}
      imgIcon={() => (
        <img
          alt={uiReference}
          src={config.icon}
          data-testid={accessibilityId}
          className={styles.communityOfficialBadge}
        />
      )}
    />
  );
}
