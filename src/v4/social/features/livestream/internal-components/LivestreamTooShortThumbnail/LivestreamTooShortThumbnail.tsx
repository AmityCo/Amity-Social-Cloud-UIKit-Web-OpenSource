import { Typography } from '~/v4/core/components';
import React from 'react';
import styles from './LivestreamTooShortThumbnail.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';

type LivestreamTooShortThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
};

export function LivestreamTooShortThumbnail({ view = 'post' }: LivestreamTooShortThumbnailProps) {
  return (
    <div className={styles.livestreamTooShortThumbnail} data-view={view}>
      <ExclamationCircle className={styles.livestreamTooShortThumbnail__icon} />
      <Typography.TitleBold>Playback unavailable</Typography.TitleBold>
      <Typography.Caption>This live stream was too short to have a playback.</Typography.Caption>
    </div>
  );
}
