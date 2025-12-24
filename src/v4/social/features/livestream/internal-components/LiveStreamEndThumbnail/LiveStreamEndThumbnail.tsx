import { Typography } from '~/v4/core/components';
import React from 'react';
import styles from './LiveStreamEndThumbnail.module.css';

type LiveStreamEndThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
};

export function LiveStreamEndThumbnail({ view = 'post' }: LiveStreamEndThumbnailProps) {
  return (
    <div className={styles.liveStreamEndThumbnail} data-view={view}>
      <Typography.TitleBold>This live stream has ended.</Typography.TitleBold>
      <Typography.Caption>
        Playback will be available for you <br /> to watch shortly.
      </Typography.Caption>
    </div>
  );
}
