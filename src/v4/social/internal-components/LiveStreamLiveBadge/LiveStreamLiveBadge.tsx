import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamLiveBadge.module.css';

export function LiveStreamLiveBadge() {
  return (
    <div className={styles.liveStreamLiveBadge}>
      <Typography.CaptionBold>Live</Typography.CaptionBold>
    </div>
  );
}
