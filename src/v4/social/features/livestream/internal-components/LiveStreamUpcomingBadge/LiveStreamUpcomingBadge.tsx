import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamUpcomingBadge.module.css';

export function LiveStreamUpcomingBadge() {
  return (
    <Typography.CaptionBold className={styles.liveStreamUpcomingBadge}>
      {useString('amity_social_event_stream_status_upcoming_live')}
    </Typography.CaptionBold>
  );
}
