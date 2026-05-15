import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
import React from 'react';
import { Typography } from '~/v4/core/components';
import {
  getLivestreamAspectRatioString,
  LivestreamResolution,
} from '~/v4/social/features/livestream/utils/getLivestreamAspectRatio';
import styles from './LiveStreamTerminatedThumbnail.module.css';

type LiveStreamTerminatedThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
  /** Resolution data for dynamic aspect ratio (from room.liveResolution) */
  resolution?: LivestreamResolution;
};

export function LiveStreamTerminatedThumbnail({
  view = 'post',
  className,
  resolution,
}: LiveStreamTerminatedThumbnailProps) {
  const aspectRatio = view === 'post' ? getLivestreamAspectRatioString(resolution) : undefined;

  return (
    <div
      className={clsx(className, styles.liveStreamTerminatedThumbnail)}
      data-view={view}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Typography.TitleBold>
        {useString('amity_social_status_create_livestream_terminated_first_reason')}
      </Typography.TitleBold>
      <Typography.Caption>
        {useString('amity_social_button_create_livestream_terminated_desc')}{' '}
        {useString('amity_social_livestream_terminated_second_reason')}
      </Typography.Caption>
    </div>
  );
}
