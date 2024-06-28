import React from 'react';
import styles from './MediaAttachment.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { FileButton } from '~/v4/social/elements/FileButton';

interface MediaAttachmentProps {
  pageId: string;
}

export function MediaAttachment({ pageId }: MediaAttachmentProps) {
  const componentId = 'media_attachment';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId} className={styles.mediaAttachment}>
      <div className={styles.mediaAttachment__swipeDown} />
      <div className={styles.mediaAttachment__wrapMedia}>
        <CameraButton pageId={pageId} componentId={componentId} />
        <ImageButton pageId={pageId} componentId={componentId} />
        <VideoButton pageId={pageId} componentId={componentId} />
      </div>
    </div>
  );
}
