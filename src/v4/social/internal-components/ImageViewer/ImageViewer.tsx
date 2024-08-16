import React, { useState } from 'react';
import useImage from '~/core/hooks/useImage';
import usePostByIds from '~/social/hooks/usePostByIds';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';

import styles from './ImageViewer.module.css';

const AngleRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5.13281 4.71094L1.71094 8.17969C1.59375 8.29688 1.40625 8.29688 1.3125 8.17969L0.84375 7.71094C0.726562 7.59375 0.726562 7.42969 0.84375 7.3125L3.60938 4.5L0.84375 1.71094C0.726562 1.59375 0.726562 1.40625 0.84375 1.3125L1.3125 0.84375C1.40625 0.726562 1.59375 0.726562 1.71094 0.84375L5.13281 4.3125C5.25 4.42969 5.25 4.59375 5.13281 4.71094Z" />
  </svg>
);

interface ImageViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post;
  initialImageIndex: number;
  onClose(): void;
}

export function ImageViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  initialImageIndex,
  onClose,
}: ImageViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);

  const posts = usePostByIds(post?.children || []);

  const imagePosts = posts.filter((post) => post.dataType === 'image');

  const selectedPost = imagePosts[selectedImageIndex];

  const imageUrl = useImage({ fileId: selectedPost?.data?.fileId });
  const hasNext = selectedImageIndex < imagePosts.length - 1;
  const hasPrev = selectedImageIndex > 0;

  const next = () => {
    if (!hasNext) {
      return;
    }
    setSelectedImageIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (!hasPrev) {
      return;
    }
    setSelectedImageIndex((prev) => prev - 1);
  };

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt={selectedPost?.data?.fileId || ''} className={styles.fullImage} />
          <div className={styles.overlayPanel}>
            {hasPrev && (
              <div className={styles.overlayPanel__prev} onClick={prev}>
                <AngleRight className={styles.overlayPanel__prevButton} />
              </div>
            )}
            <div className={styles.overlayPanel__middle} />
            {hasNext && (
              <div className={styles.overlayPanel__next} onClick={next}>
                <AngleRight className={styles.overlayPanel__nextButton} />
              </div>
            )}
          </div>
          <span className={styles.closeButton}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.imageViewer__clearButton}
              imgClassName={styles.imageViewer__clearButton__img}
              onPress={onClose}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
