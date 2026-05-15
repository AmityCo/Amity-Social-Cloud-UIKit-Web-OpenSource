import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
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
      <Typography.TitleBold>
        {useString('amity_social_label_livestream_post_thumbnail_unavailable_title')}
      </Typography.TitleBold>
      {view === 'full-screen' && (
        <Typography.Caption>
          {useString('amity_social_player_unavailable_message')}
        </Typography.Caption>
      )}
    </div>
  );
}
