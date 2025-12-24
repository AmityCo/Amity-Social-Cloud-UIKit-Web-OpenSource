import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamLiveBadge.module.css';

export function LiveStreamLiveBadge({
  className,
  duration,
  size = 'large',
}: {
  className?: string;
  duration?: string;
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <div className={clsx(styles.liveStreamLiveBadge, className)} data-size={size}>
      <Typography.CaptionBold>Live</Typography.CaptionBold>
      {duration && <Typography.CaptionBold>{' ' + duration}</Typography.CaptionBold>}
    </div>
  );
}
