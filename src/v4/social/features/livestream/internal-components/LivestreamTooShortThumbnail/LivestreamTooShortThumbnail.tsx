import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import React from 'react';
import styles from './LivestreamTooShortThumbnail.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';

type LivestreamTooShortThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
};

export function LivestreamTooShortThumbnail({ view = 'post' }: LivestreamTooShortThumbnailProps) {
  const playbackUnavailableLabel = useString('amity_social_label_playback_unavailable');
  return (
    <div className={styles.livestreamTooShortThumbnail} data-view={view}>
      <ExclamationCircle className={styles.livestreamTooShortThumbnail__icon} />
      <Typography.TitleBold>{playbackUnavailableLabel}</Typography.TitleBold>
      <Typography.Caption>
        {useString('amity_social_status_livestream_post_thumbnail_ended_too_short_desc')}
      </Typography.Caption>
    </div>
  );
}
