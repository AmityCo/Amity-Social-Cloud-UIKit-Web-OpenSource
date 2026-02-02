import React from 'react';
import clsx from 'clsx';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import styles from './MediaAttachment.module.css';
import { ProductTagActionButton } from '~/v4/social/features/product-tagged';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

const MAX_UPLOAD_MEDIA = 10;

interface MediaAttachmentProps {
  pageId: string;
  isVisibleCamera: boolean;
  isVisibleImage: boolean;
  isVisibleVideo: boolean;
  totalMedia?: number;
  productTags?: Amity.ProductTag[];
  onVideoFileChange?: (files: File[], fileType?: string) => void;
  onImageFileChange?: (files: File[], fileType?: string) => void;
}

export function MediaAttachment({
  pageId,
  isVisibleCamera,
  isVisibleImage,
  isVisibleVideo,
  totalMedia = 0,
  productTags = [],
  onVideoFileChange,
  onImageFileChange,
}: MediaAttachmentProps) {
  const componentId = 'media_attachment';
  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });
  const { isDesktop } = useResponsive();

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.mediaAttachment}>
      <div className={styles.mediaAttachment__swipeDown} />
      <div className={styles.mediaAttachment__actionButton_wrapper}>
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
              isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
            />
          )}
          {isVisibleImage && (
            <ImageButton
              pageId={pageId}
              componentId={componentId}
              onImageFileChange={onImageFileChange}
              isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
            />
          )}

          {isVisibleVideo && (
            <VideoButton
              pageId={pageId}
              componentId={componentId}
              onVideoFileChange={onVideoFileChange}
              isDisabled={!!totalMedia && totalMedia >= MAX_UPLOAD_MEDIA}
            />
          )}
        </div>
        {isDesktop && productTags.length > 0 && (
          <ProductTagActionButton
            productTags={productTags}
            pageId={pageId}
            className={styles.mediaAttachment__productTagButton}
          />
        )}
      </div>
    </div>
  );
}
