import clsx from 'clsx';
import React from 'react';
import { Lock } from '~/v4/icons/Lock';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CommunityPrivateBadge.module.css';

export type CommunityPrivateBadgeProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
};

export function CommunityPrivateBadge({
  className,
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
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
      defaultIcon={() => (
        <Lock
          style={themeStyles}
          data-testid={accessibilityId}
          className={clsx(styles.communityPrivateBadge, className)}
        />
      )}
      imgIcon={() => (
        <img
          src={config.icon}
          alt={uiReference}
          data-testid={accessibilityId}
          className={styles.communityPrivateBadge}
        />
      )}
    />
  );
}
