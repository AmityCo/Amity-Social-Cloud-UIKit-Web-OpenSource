import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import styles from './DetailedMediaAttachment.module.css';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton/VideoButton';
import { FileButton } from '~/v4/social/elements/FileButton';

interface DetailedMediaAttachmentProps {
  pageId: string;
}

export function DetailedMediaAttachment({ pageId }: DetailedMediaAttachmentProps) {
  const componentId = 'detailed_media_attachment';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.detailedMediaAttachment}
    >
      <div className={styles.detailedMediaAttachment__swipeDown} />
      <CameraButton pageId={pageId} componentId={componentId} />
      <ImageButton pageId={pageId} componentId={componentId} />
      <VideoButton pageId={pageId} componentId={componentId} />
    </div>
  );
}
