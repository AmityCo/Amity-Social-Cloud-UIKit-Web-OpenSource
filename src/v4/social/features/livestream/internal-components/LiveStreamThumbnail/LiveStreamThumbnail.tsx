import React from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import liveStreamDefaultThumbnail from '~/v4/social/assets/images/livestream-default-thumbnail.png';
import styles from './LiveStreamThumbnail.module.css';

type LiveStreamThumbnailProps = { fileId?: string; alt: string };

export function LiveStreamThumbnail({ fileId, alt }: LiveStreamThumbnailProps) {
  const videoThumbnailUrl = useImage({ fileId });

  return (
    <img
      alt={alt}
      loading="lazy"
      src={videoThumbnailUrl ?? liveStreamDefaultThumbnail}
      className={styles.liveStreamThumbnail}
    />
  );
}
