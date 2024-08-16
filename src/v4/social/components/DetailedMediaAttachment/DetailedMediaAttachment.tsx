import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import styles from './DetailedMediaAttachment.module.css';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton/VideoButton';

interface DetailedMediaAttachmentProps {
  pageId: string;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  onVideoFileChange?: (files: File[]) => void;
  onImageFileChange?: (files: File[]) => void;
}

export function DetailedMediaAttachment({
  pageId,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  onVideoFileChange,
  onImageFileChange,
}: DetailedMediaAttachmentProps) {
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
      {isVisibleCamera && (
        <CameraButton
          pageId={pageId}
          componentId={componentId}
          isVisibleImage={isVisibleImage}
          isVisibleVideo={isVisibleVideo}
          onVideoFileChange={onVideoFileChange}
          onImageFileChange={onImageFileChange}
        />
      )}
      {isVisibleImage && (
        <ImageButton
          pageId={pageId}
          componentId={componentId}
          onImageFileChange={onImageFileChange}
        />
      )}

      {isVisibleVideo && (
        <VideoButton
          pageId={pageId}
          componentId={componentId}
          onVideoFileChange={onVideoFileChange}
        />
      )}
    </div>
  );
}
