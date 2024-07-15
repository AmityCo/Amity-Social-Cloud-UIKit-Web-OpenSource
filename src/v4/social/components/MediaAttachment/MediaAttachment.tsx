import React from 'react';
import styles from './MediaAttachment.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import clsx from 'clsx';

interface MediaAttachmentProps {
  pageId: string;
  uploadLoading?: boolean;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  onVideoFileChange?: (files: File[]) => void;
  onImageFileChange?: (files: File[]) => void;
}

export function MediaAttachment({
  pageId,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  onVideoFileChange,
  onImageFileChange,
}: MediaAttachmentProps) {
  const componentId = 'media_attachment';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId} className={styles.mediaAttachment}>
      <div className={styles.mediaAttachment__swipeDown} />
      <div
        className={clsx(
          !isVisibleImage || !isVisibleVideo || !isVisibleCamera
            ? styles.mediaAttachment__wrapMedia_2items
            : styles.mediaAttachment__wrapMedia,
        )}
      >
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
    </div>
  );
}
