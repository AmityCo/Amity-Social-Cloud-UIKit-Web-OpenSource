import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamUpcomingBadge.module.css';

export function LiveStreamUpcomingBadge() {
  return (
    <Typography.CaptionBold className={styles.liveStreamUpcomingBadge}>
      Upcoming Live
    </Typography.CaptionBold>
  );
}
