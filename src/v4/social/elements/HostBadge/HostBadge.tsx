import React from 'react';
import styles from './HostBadge.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import { LivestreamOutlined } from '~/v4/icons/LivestreamOutlined';
import { Typography } from '~/v4/core/components';

interface HostBadgeProps {
  pageId?: string;
  componentId?: string;
  className?: string;
}

export function HostBadge({ pageId = '*', componentId = '*', className }: HostBadgeProps) {
  const elementId = 'host_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div
      className={clsx(styles.hostBadge, className)}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      <LivestreamOutlined className={styles.hostBadge__icon} />
      <Typography.CaptionSmall className={styles.hostBadge__text}>
        {config.text ?? 'Host'}
      </Typography.CaptionSmall>
    </div>
  );
}
