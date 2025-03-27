import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamLiveBadge.module.css';

export function LiveStreamLiveBadge() {
  return (
    <Typography.CaptionBold className={styles.liveStreamLiveBadge}>Live</Typography.CaptionBold>
  );
}
