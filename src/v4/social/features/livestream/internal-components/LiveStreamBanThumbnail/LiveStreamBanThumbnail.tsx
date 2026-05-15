import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import React from 'react';
import styles from './LiveStreamBanThumbnail.module.css';

type LiveStreamBanThumbnailProps = {
  view?: 'post' | 'full-screen';
};

export function LiveStreamBanThumbnail({ view = 'post' }: LiveStreamBanThumbnailProps) {
  return (
    <div className={styles.liveStreamBanThumbnail} data-view={view}>
      <Typography.TitleBold>{useString('amity_social_label_banned_title')}</Typography.TitleBold>
      <Typography.Caption>{useString('amity_social_status_banned_desc')}</Typography.Caption>
    </div>
  );
}
