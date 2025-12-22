import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './LiveStreamTerminatedThumbnail.module.css';

type LiveStreamTerminatedThumbnailProps = {
  className?: string;
  view?: 'post' | 'full-screen';
};

export function LiveStreamTerminatedThumbnail({
  view = 'post',
  className,
}: LiveStreamTerminatedThumbnailProps) {
  return (
    <div className={clsx(className, styles.liveStreamTerminatedThumbnail)} data-view={view}>
      <Typography.TitleBold>The live stream has been terminated.</Typography.TitleBold>
      <Typography.Caption>
        It looks like the live stream you're watching goes against our content moderation
        guidelines. There will be no playback of this live stream on any feeds.
      </Typography.Caption>
    </div>
  );
}
