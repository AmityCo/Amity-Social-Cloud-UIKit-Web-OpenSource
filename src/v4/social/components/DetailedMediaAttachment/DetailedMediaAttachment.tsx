import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import styles from './DetailedMediaAttachment.module.css';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton/VideoButton';
import { FileButton } from '~/v4/social/elements/FileButton';

interface DetailedMediaAttachmentProps {
  pageId: string;
  uploadLoading?: boolean;
  onChangeImages?: (files: File[]) => void;
  onChangeVideos?: (files: File[]) => void;
  onChangeThumbnail?: (
    thumbnail: { file: File; videoUrl: string; thumbnail: string | undefined }[],
  ) => void;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  videoThumbnail?: { file: File; videoUrl: string; thumbnail: string | undefined }[];
}

export function DetailedMediaAttachment({
  pageId,
  uploadLoading,
  onChangeImages,
  onChangeVideos,
  onChangeThumbnail,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  videoThumbnail,
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
  );
}
