import React, { useState } from 'react';
import styles from './ImageGallery.module.css';
import { useImage } from '~/v4/core/hooks/useImage';
import { SingleImageViewer } from '~/v4/social/internal-components/SingleImageViewer';
import { Button } from '~/v4/core/natives/Button';

const ImageItem = ({
  fileId,
  postIndex,
  onClickImageItem,
}: {
  fileId: string;
  postIndex: number;
  onClickImageItem: (postIndex: number) => void;
}) => {
  const image = useImage({ fileId, imageSize: 'medium' });

  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return image && !isBrokenImg ? (
    <Button
      className={styles.imageGallery__itemContainer}
      onPress={() => onClickImageItem(postIndex)}
    >
      <img
        className={styles.imageGallery__item}
        src={image}
        alt={`${fileId}`}
        onError={() => setIsBrokenImg(true)}
      />
    </Button>
  ) : (
    <Button
      className={styles.imageGallery__itemContainer}
      onPress={() => onClickImageItem(postIndex)}
    >
      <div className={styles.imageGallery__brokenImg} />
    </Button>
  );
};

interface ImageGalleryProps {
  posts?: Amity.Post[] | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  posts,
  pageId,
  componentId,
  elementId,
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const onClickImageItem = (postIndex: number) => {
    setSelectedImageIndex(postIndex);
    setIsImageViewerOpen(true);
  };

  return (
    <div className={styles.imageGallery}>
      {posts?.map((post, index) => (
        <ImageItem
          key={post?.data?.fileId}
          fileId={post?.data?.fileId}
          postIndex={index}
          onClickImageItem={onClickImageItem}
        />
      ))}
      {posts && isImageViewerOpen && selectedImageIndex !== null && (
        <SingleImageViewer
          fileId={posts[selectedImageIndex]?.data?.fileId}
          onClose={() => setIsImageViewerOpen(false)}
          pageId={pageId}
          componentId={componentId}
          elementId={elementId}
        />
      )}
    </div>
  );
};
