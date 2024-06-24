import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CommunityOfficialBadge.module.css';

const OfficialBadgeIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    {...props}
  >
    <path d="M9.58112 15.4777C10.2749 16.1767 10.9373 16.1715 11.6363 15.4777L12.4188 14.6953C12.4918 14.6223 12.5544 14.6014 12.6483 14.6014H13.7541C14.74 14.6014 15.2095 14.1319 15.2095 13.1461V12.0402C15.2095 11.9463 15.2355 11.8785 15.3034 11.8107L16.0858 11.023C16.7848 10.3293 16.7796 9.66681 16.0858 8.97305L15.3034 8.19061C15.2355 8.11758 15.2095 8.05499 15.2095 7.9611V6.85525C15.2095 5.86938 14.74 5.39991 13.7541 5.39991H12.6483C12.5544 5.39991 12.4866 5.37383 12.4188 5.30602L11.6363 4.52358C10.9373 3.82461 10.2749 3.82461 9.58112 4.5288L8.79868 5.30602C8.73087 5.37383 8.66306 5.39991 8.56917 5.39991H7.46332C6.47745 5.39991 6.00799 5.85894 6.00799 6.85525V7.9611C6.00799 8.05499 5.9819 8.1228 5.91409 8.19061L5.13165 8.97305C4.43268 9.66681 4.43789 10.3293 5.13165 11.023L5.91409 11.8107C5.9819 11.8785 6.00799 11.9463 6.00799 12.0402V13.1461C6.00799 14.1319 6.47745 14.6014 7.46332 14.6014H8.56917C8.66306 14.6014 8.72565 14.6223 8.79868 14.6953L9.58112 15.4777ZM9.74282 12.6714C9.56026 12.6714 9.4142 12.6036 9.29944 12.4836L7.63024 10.6162C7.54156 10.5223 7.49462 10.3919 7.49462 10.2615C7.49462 9.94849 7.71892 9.72419 8.04232 9.72419C8.21968 9.72419 8.35008 9.78157 8.46484 9.90676L9.72196 11.3099L12.2362 7.72115C12.3614 7.5438 12.497 7.47077 12.7057 7.47077C13.0291 7.47077 13.2586 7.69507 13.2586 7.99761C13.2586 8.10193 13.2169 8.23234 13.1386 8.34188L10.2123 12.4471C10.0923 12.6036 9.93583 12.6714 9.74282 12.6714Z" />
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
