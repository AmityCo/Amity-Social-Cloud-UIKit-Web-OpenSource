import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CommunityOfficialBadge.module.css';

const OfficialBadgeIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    {...props}
  >
    <path
      d="M9.11463 13.479C8.41557 14.1728 7.75304 14.178 7.0592 13.479L6.27668 12.6964C6.20364 12.6234 6.14104 12.6025 6.04714 12.6025H4.94117C3.95519 12.6025 3.48568 12.133 3.48568 11.147V10.0411C3.48568 9.94718 3.45959 9.87936 3.39177 9.81154L2.60925 9.0238C1.91541 8.32996 1.9102 7.66743 2.60925 6.97359L3.39177 6.19107C3.45959 6.12325 3.48568 6.05543 3.48568 5.96153V4.85556C3.48568 3.85915 3.95519 3.40007 4.94117 3.40007H6.04714C6.14104 3.40007 6.20886 3.37398 6.27668 3.30616L7.0592 2.52886C7.75304 1.82459 8.41557 1.82459 9.11463 2.52364L9.89715 3.30616C9.96497 3.37398 10.0328 3.40007 10.1267 3.40007H11.2327C12.2186 3.40007 12.6882 3.86958 12.6882 4.85556V5.96153C12.6882 6.05543 12.7142 6.11803 12.7821 6.19107L13.5646 6.97359C14.2584 7.66743 14.2636 8.32996 13.5646 9.0238L12.7821 9.81154C12.7142 9.87936 12.6882 9.94718 12.6882 10.0411V11.147C12.6882 12.133 12.2186 12.6025 11.2327 12.6025H10.1267C10.0328 12.6025 9.97019 12.6234 9.89715 12.6964L9.11463 13.479Z"
      fill="#1054DE"
    />
    <path
      d="M6.77768 10.4846C6.89245 10.6045 7.03852 10.6724 7.22111 10.6724C7.41413 10.6724 7.57063 10.6045 7.69062 10.448L10.6173 6.3424C10.6955 6.23285 10.7372 6.10243 10.7372 5.99809C10.7372 5.69551 10.5077 5.47119 10.1843 5.47119C9.97559 5.47119 9.83995 5.54423 9.71475 5.7216L7.20024 9.31077L5.94299 7.90745C5.82822 7.78224 5.69779 7.72486 5.52042 7.72486C5.19698 7.72486 4.97266 7.94918 4.97266 8.26219C4.97266 8.39261 5.01961 8.52303 5.10829 8.61694L6.77768 10.4846Z"
      fill="white"
    />
  </svg>
);

export interface CommunityOfficialBadgeProps {
  pageId?: string;
  componentId?: string;
}

export function CommunityOfficialBadge({
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
      defaultIcon={() => (
        <OfficialBadgeIconSvg
          style={themeStyles}
          className={clsx(styles.communityOfficialBadge, styles.communityOfficialBadge__iconSvg)}
          data-qa-anchor={accessibilityId}
        />
      )}
      imgIcon={() => (
        <img
          data-qa-anchor={accessibilityId}
          src={config.icon}
          alt={uiReference}
          className={styles.communityOfficialBadge}
        />
      )}
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
    />
  );
}
