import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton/VideoButton';
import { ProductTagButton } from '~/v4/social/features/product-tagged';
import { MEDIA_ATTACHMENT_CAP } from '~/v4/social/features/posts/constants';
import styles from './DetailedMediaAttachment.module.css';

interface DetailedMediaAttachmentProps {
  pageId: string;
  sourceId?: string;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  totalMedia?: number;
  productTags?: Amity.ProductTag[];
  onVideoFileChange?: (files: File[]) => void;
  onImageFileChange?: (files: File[]) => void;
}

export function DetailedMediaAttachment({
  pageId,
  sourceId = '',
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  totalMedia = 0,
  productTags = [],
  onVideoFileChange,
  onImageFileChange,
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
          isDisabled={!!totalMedia && totalMedia >= MEDIA_ATTACHMENT_CAP}
          onVideoFileChange={onVideoFileChange}
          onImageFileChange={onImageFileChange}
          textId="amity_social_button_post_composer_camera_button"
        />
      )}
      {isVisibleImage && (
        <ImageButton
          pageId={pageId}
          componentId={componentId}
          isDisabled={!!totalMedia && totalMedia >= MEDIA_ATTACHMENT_CAP}
          onImageFileChange={onImageFileChange}
          textId="amity_social_button_post_composer_image_button"
        />
      )}

      {isVisibleVideo && (
        <VideoButton
          pageId={pageId}
          componentId={componentId}
          isDisabled={!!totalMedia && totalMedia >= MEDIA_ATTACHMENT_CAP}
          onVideoFileChange={onVideoFileChange}
          textId="amity_social_button_post_composer_video_button"
        />
      )}

      {productTags.length > 0 && (
        <ProductTagButton
          variant="detailed"
          pageId={pageId}
          sourceId={sourceId}
          productTags={productTags}
        />
      )}
    </div>
  );
}
