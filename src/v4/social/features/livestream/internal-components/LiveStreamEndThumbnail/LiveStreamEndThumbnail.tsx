import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import React from 'react';
import {
  getLivestreamAspectRatioString,
  LivestreamResolution,
} from '~/v4/social/features/livestream/utils/getLivestreamAspectRatio';
import styles from './LiveStreamEndThumbnail.module.css';

type LiveStreamEndThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
  /** Resolution data for dynamic aspect ratio (from room.liveResolution) */
  resolution?: LivestreamResolution;
};

export function LiveStreamEndThumbnail({ view = 'post', resolution }: LiveStreamEndThumbnailProps) {
  const aspectRatio = view === 'post' ? getLivestreamAspectRatioString(resolution) : undefined;

  return (
    <div
      className={styles.liveStreamEndThumbnail}
      data-view={view}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Typography.TitleBold>
        {useString('amity_social_status_livestream_post_thumbnail_processing_title')}
      </Typography.TitleBold>
      <Typography.Caption>
        {useString('amity_social_label_livestream_post_thumbnail_processing_desc')}
      </Typography.Caption>
    </div>
  );
}
