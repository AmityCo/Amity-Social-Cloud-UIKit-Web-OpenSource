import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamRecordedBadge.module.css';

export function LiveStreamRecordedBadge() {
  return (
    <Typography.CaptionBold className={styles.liveStreamRecordedBadge}>
      {useString('amity_social_event_stream_status_recorded')}
    </Typography.CaptionBold>
  );
}
