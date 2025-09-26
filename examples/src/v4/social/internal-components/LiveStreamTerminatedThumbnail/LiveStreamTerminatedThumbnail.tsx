import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamTerminatedThumbnail.module.css';

export function LiveStreamTerminatedThumbnail() {
  return (
    <div className={styles.liveStreamTerminatedThumbnail}>
      <Typography.TitleBold className={styles.liveStreamTerminatedThumbnail__text}>
        The live stream has been terminated.
      </Typography.TitleBold>
      <Typography.Caption className={styles.liveStreamTerminatedThumbnail__text}>
        It looks like the live stream you're watching goes against our content moderation
        guidelines. There will be no playback of this live stream on any feeds.
      </Typography.Caption>
    </div>
  );
}
