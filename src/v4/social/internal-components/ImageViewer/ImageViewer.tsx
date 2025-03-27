import React, { useState } from 'react';
import useImage from '~/core/hooks/useImage';
import { useKeyPressEvent } from 'react-use';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import useSwiper from '~/v4/social/hooks/useSwiper';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import styles from './ImageViewer.module.css';

//TODO: After SDK update getPostChildren should be used instead of usePost

type ImageViewerProps = {
  pageId?: string;
  onClose(): void;
  post: Amity.Post;
  elementId?: string;
  componentId?: string;
  initialImageIndex: number;
};

export function ImageViewer({
  post,
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialImageIndex,
}: ImageViewerProps) {
  useKeyPressEvent('Escape', onClose);

  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const { post: imagePost } = usePost(post?.children[selectedImageIndex]);
  const imageUrl = useImage({ fileId: imagePost?.data?.fileId });
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const next = () => {
    if (hasNext) setSelectedImageIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setSelectedImageIndex((prev) => prev - 1);
  };

  const hasNext = selectedImageIndex < post?.children.length - 1;
  const hasPrev = selectedImageIndex > 0;

  const { handleTouchEnd, handleTouchMove, handleTouchStart } = useSwiper({ next, prev });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.imageViewer__modal}>
      <span className={styles.imageViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={onClose}
          componentId={componentId}
          defaultClassName={styles.imageViewer__closeButton}
          imgClassName={styles.imageViewer__closeButton__img}
        />
      </span>
      {post?.children.length > 1 && (
        <Typography.TitleBold className={styles.imageViewer__count}>
          {selectedImageIndex + 1} / {post?.children.length}
        </Typography.TitleBold>
      )}
      {hasPrev && (
        <Button className={styles.imageViewer__prev} onPress={prev}>
          <ChevronRight className={styles.imageViewer__prevButton} />
        </Button>
      )}
      {imageUrl && !isBrokenImg ? (
        <img
          src={imageUrl}
          alt={imageUrl || ''}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          className={styles.imageViewer__fullImage}
          onError={() => setIsBrokenImg(true)}
        />
      ) : (
        <div className={styles.imageViewer__itemContainer} />
      )}

      {hasNext && (
        <Button className={styles.imageViewer__next} onPress={next}>
          <ChevronRight className={styles.imageViewer__nextButton} />
        </Button>
      )}
    </div>
  );
}
