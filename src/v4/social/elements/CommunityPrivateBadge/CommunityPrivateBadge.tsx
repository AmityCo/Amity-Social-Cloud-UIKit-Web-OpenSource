import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './CommunityPrivateBadge.module.css';

const PrivateIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="11"
    height="12"
    viewBox="0 0 11 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5.60938 9.72656C5.26562 9.72656 5.00781 9.46875 5.00781 9.125V7.75C5.00781 7.42773 5.26562 7.14844 5.60938 7.14844C5.93164 7.14844 6.21094 7.42773 6.21094 7.75V9.125C6.21094 9.46875 5.93164 9.72656 5.60938 9.72656ZM10.4219 6.03125V10.8438C10.4219 11.4238 9.94922 11.875 9.39062 11.875H1.82812C1.24805 11.875 0.796875 11.4238 0.796875 10.8438V6.03125C0.796875 5.47266 1.24805 5 1.82812 5H2.51562V3.96875C2.51562 2.27148 3.89062 0.875 5.60938 0.875C7.32812 0.896484 8.70312 2.29297 8.70312 4.01172V5H9.39062C9.94922 5 10.4219 5.47266 10.4219 6.03125ZM3.54688 5H7.67188V3.96875C7.67188 2.85156 6.72656 1.90625 5.60938 1.90625C4.4707 1.90625 3.54688 2.85156 3.54688 3.96875V5ZM9.39062 6.03125H1.82812V10.8438H9.39062V6.03125Z" />
  </svg>
);

export interface CommunityPrivateBadgeProps {
  pageId?: string;
  componentId?: string;
}

export function CommunityPrivateBadge({
  pageId = '*',
  componentId = '*',
}: CommunityPrivateBadgeProps) {
  const elementId = 'community_private_badge';
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
        <PrivateIconSvg
          style={themeStyles}
          className={clsx(styles.communityPrivateBadge, styles.communityPrivateBadge__iconSvg)}
          data-qa-anchor={accessibilityId}
        />
      )}
      imgIcon={() => (
        <img
          data-qa-anchor={accessibilityId}
          src={config.icon}
          alt={uiReference}
          className={styles.communityPrivateBadge}
        />
      )}
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
    />
  );
}
