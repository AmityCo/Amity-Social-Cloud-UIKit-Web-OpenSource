import clsx from 'clsx';
import { resolveString } from '~/v4/core/localization';
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
      <Typography.CaptionBold>
        {resolveString('amity_social_status_live_stream_duration_label', duration ?? '').trim()}
      </Typography.CaptionBold>
    </div>
  );
}
