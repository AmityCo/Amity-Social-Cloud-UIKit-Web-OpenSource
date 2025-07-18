import { Typography } from '~/v4/core/components';
import React from 'react';
import styles from './LiveStreamBanThumbnail.module.css';

type LiveStreamBanThumbnailProps = {
  view?: 'post' | 'full-screen';
};

export function LiveStreamBanThumbnail({ view = 'post' }: LiveStreamBanThumbnailProps) {
  return (
    <div className={styles.LiveStreamBanThumbnail} data-view={view}>
      <Typography.TitleBold>You’ve been banned.</Typography.TitleBold>
      <Typography.Caption>You can no longer access this live stream.</Typography.Caption>
    </div>
  );
}
