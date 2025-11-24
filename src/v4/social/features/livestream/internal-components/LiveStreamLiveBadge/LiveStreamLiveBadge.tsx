import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamLiveBadge.module.css';

export function LiveStreamLiveBadge({
  className,
  duration,
}: {
  className?: string;
  duration?: string;
}) {
  return (
    <div className={clsx(styles.liveStreamLiveBadge, className)}>
      <Typography.CaptionBold>Live</Typography.CaptionBold>
      {duration && <Typography.CaptionBold>{' ' + duration}</Typography.CaptionBold>}
    </div>
  );
}
