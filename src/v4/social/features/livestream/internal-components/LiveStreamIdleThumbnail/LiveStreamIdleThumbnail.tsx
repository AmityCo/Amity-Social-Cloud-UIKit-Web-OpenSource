import { Typography } from '~/v4/core/components';
import React from 'react';
import styles from './LiveStreamIdleThumbnail.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';

type LiveStreamIdleThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
};

export function LiveStreamIdleThumbnail({ view = 'post' }: LiveStreamIdleThumbnailProps) {
  return (
    <div className={styles.liveStreamIdleThumbnail} data-view={view}>
      <ExclamationCircle className={styles.liveStreamIdleThumbnail__icon} />
      <Typography.TitleBold>This stream is currently unavailable.</Typography.TitleBold>
      {view === 'full-screen' && <Typography.Caption>Please try again later.</Typography.Caption>}
    </div>
  );
}
