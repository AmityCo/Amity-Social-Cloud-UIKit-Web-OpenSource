import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton/VideoButton';
import { FileButton } from '~/v4/social/elements/FileButton/FileButton';
import styles from './DetailedMediaAttachment.module.css';

const MAX_UPLOAD_MEDIA = 10;

interface DetailedMediaAttachmentProps {
  pageId: string;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  isVisibleFile?: boolean;
  totalMedia?: number;
  onVideoFileChange?: (files: File[]) => void;
  onImageFileChange?: (files: File[]) => void;
  onFileChange?: (files: File[]) => void;
}

export function DetailedMediaAttachment({
  pageId,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  isVisibleFile = false,
  totalMedia = 0,
  onVideoFileChange,
  onImageFileChange,
  onFileChange,
}: DetailedMediaAttachmentProps) {
  const componentId = 'detailed_media_attachment';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.detailedMediaAttachment}
    >
      <div className={styles.detailedMediaAttachment__swipeDown} />
      {isVisibleCamera && (
        <CameraButton
          pageId={pageId}
          componentId={componentId}
          isVisibleImage={isVisibleImage}
          isVisibleVideo={isVisibleVideo}
          isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
          onVideoFileChange={onVideoFileChange}
          onImageFileChange={onImageFileChange}
        />
      )}
      {isVisibleImage && (
        <ImageButton
          pageId={pageId}
          componentId={componentId}
          isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
          onImageFileChange={onImageFileChange}
        />
      )}

      {isVisibleVideo && (
        <VideoButton
          pageId={pageId}
          componentId={componentId}
          isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
          onVideoFileChange={onVideoFileChange}
        />
      )}

      {isVisibleFile && (
        <FileButton
          pageId={pageId}
          componentId={componentId}
          isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
          onFileChange={onFileChange}
        />
      )}
    </div>
  );
}
