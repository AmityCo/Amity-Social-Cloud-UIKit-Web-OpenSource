import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamRecordedBadge.module.css';

export function LiveStreamRecordedBadge() {
  return (
    <Typography.CaptionBold className={styles.liveStreamRecordedBadge}>
      Recorded
    </Typography.CaptionBold>
  );
}
