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
  onChangeImages?: (files: File[]) => void;
  onChangeVideos?: (files: File[]) => void;
  onChangeThumbnail?: (thumbnail: { file: File; videoUrl: string; thumbnail: string | undefined }[]) => void;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  videoThumbnail?: { file: File; videoUrl: string; thumbnail: string | undefined }[];
}

export function MediaAttachment({
  pageId,
  uploadLoading,
  onChangeImages,
  onChangeVideos,
  onChangeThumbnail,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  videoThumbnail,
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
            onChange={onChangeImages}
            isVisibleImage={isVisibleImage}
            isVisibleVideo={isVisibleVideo}
            onChangeVideos={onChangeVideos}
            videoThumbnail={videoThumbnail}
            onChangeThumbnail={onChangeThumbnail}
          />
        )}
        {isVisibleImage && (
          <ImageButton pageId={pageId} componentId={componentId} onChange={onChangeImages} />
        )}

        {isVisibleVideo && (
          <VideoButton
            pageId={pageId}
            componentId={componentId}
            onChangeVideos={onChangeVideos}
            onChangeThumbnail={onChangeThumbnail}
            videoThumbnail={videoThumbnail}
          />
        )}
      </div>
    </div>
  );
}
