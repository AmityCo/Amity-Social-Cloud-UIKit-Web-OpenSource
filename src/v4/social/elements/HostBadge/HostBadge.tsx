import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './HostBadge.module.css';
import Livestream from '~/v4/icons/Livestream';

type HostBadgeProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
};

export function HostBadge({ className }: HostBadgeProps) {
  return (
    <div data-testid="host-badge" className={clsx(styles.hostBadge, className)}>
      <Livestream className={styles.hostBadge__icon} />
      <Typography.CaptionSmall className={styles.hostBadge__text}>Host</Typography.CaptionSmall>
    </div>
  );
}
