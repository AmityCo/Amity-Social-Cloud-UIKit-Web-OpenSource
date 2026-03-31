import React from 'react';
import styles from './CoHostBadge.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { PersonOutline } from '~/v4/icons/PersonOutline';

interface CoHostBadgeProps {
  pageId?: string;
  componentId?: string;
  className?: string;
}

export function CoHostBadge({ pageId = '*', componentId = '*', className }: CoHostBadgeProps) {
  const elementId = 'co_host_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div
      className={clsx(styles.coHostBadge, className)}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      <PersonOutline className={styles.coHostBadge__icon} />
      <Typography.CaptionSmall className={styles.coHostBadge__text}>
        {config.text ?? 'Co-Host'}
      </Typography.CaptionSmall>
    </div>
  );
}
