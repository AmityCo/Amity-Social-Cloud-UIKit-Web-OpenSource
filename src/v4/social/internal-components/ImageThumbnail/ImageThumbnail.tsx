import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';
import CloseIcon from '~/v4/icons/Close';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { ProgressSpinner } from '~/v4/social/internal-components/ProgressSpinner/ProgressSpinner';
import { getImageUrl } from '~/v4/utils/getImageUrl';
import { isAmityFile, isImageFile } from '~/v4/utils/checkFileType';
import styles from './ImageThumbnail.module.css';
import { useImage } from '~/v4/core/hooks/useImage';

interface PostImageItemProps {
  post: Amity.Post<'image'>;
  onRemovePostImage: (fileId: string) => void;
  pageId: string;
  componentId: string;
  totalImages: number;
}

// Separate component for each post image to properly handle hooks
const PostImageItem = ({
  post,
  onRemovePostImage,
  pageId,
  componentId,
  totalImages,
}: PostImageItemProps) => {
  const thumbnailUrl = useImage({ fileId: post.data.fileId });

  if (!thumbnailUrl) return null;

  return (
    <div
      key={`post-${post.data.fileId}`}
      data-images-height={totalImages > 2}
      className={styles.thumbnail__wrapper}
    >
      <img className={styles.thumbnail} src={thumbnailUrl} alt="post thumbnail" />
      <Button
        data-testid={`${pageId}/${componentId}/remove_thumbnail`}
        type="reset"
        className={styles.closeButton}
        onPress={() => onRemovePostImage(post.data.fileId)}
      >
        <CloseIcon className={styles.closeIcon} />
      </Button>
    </div>
  );
};

interface ImageThumbnailProps {
  pageId?: string;
  componentId?: string;
  progress: { [key: string]: number };
  files: TFileItem[];
  removeFile: (file: File | Amity.File, index?: number) => void;
  postImages?: Amity.Post<'image'>[];
  onRemovePostImage?: (fileId: string) => void;
}

export function ImageThumbnail({
  pageId = '*',
  componentId = '*',
  progress,
  removeFile,
  files,
  postImages = [],
  onRemovePostImage,
}: ImageThumbnailProps) {
  const hasNewImages = files.length > 0 && files.some((file) => isImageFile(file));
  const hasPostImages = postImages.length > 0;

  if (!hasNewImages && !hasPostImages) return null;

  // Calculate total images for layout
  const totalImages =
    (hasNewImages ? files.filter((file) => isImageFile(file)).length : 0) +
    (hasPostImages ? postImages.length : 0);

  return (
    <div data-images-amount={Math.min(totalImages, 3)} className={styles.thumbnail__container}>
      {/* Render existing post images */}
      {postImages?.map((post) => (
        <PostImageItem
          key={post.data.fileId}
          post={post}
          onRemovePostImage={onRemovePostImage || (() => {})}
          pageId={pageId}
          componentId={componentId}
          totalImages={totalImages}
        />
      ))}

      {/* Render new uploads */}
      {files
        .filter((file) => isImageFile(file))
        .map((file, index) => (
          <div
            key={`file-${file.id}`}
            data-images-height={totalImages > 2}
            className={styles.thumbnail__wrapper}
          >
            {progress[file.id] || !isAmityFile(file.file) ? (
              <>
                <img
                  src={getImageUrl(file)}
                  className={styles.thumbnail}
                  alt={isAmityFile(file.file) ? file.file.attributes?.name : 'image thumbnail'}
                />
                <div className={styles.thumbnail__overlay} />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file.file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
                <div className={styles.icon__status}>
                  <ProgressSpinner progress={progress[file.id] ?? 100} />
                </div>
              </>
            ) : file.errorText && !('fileId' in file) ? (
              <>
                <img
                  src={getImageUrl(file)}
                  className={styles.thumbnail}
                  alt={isAmityFile(file.file) ? file.file.attributes?.name : 'image thumbnail'}
                />
                <div className={styles.thumbnail__overlay} />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file.file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
                <div className={styles.icon__status__error}>
                  <ExclamationCircle />
                </div>
              </>
            ) : (
              <>
                <img
                  data-testid={`${pageId}/${componentId}/image_thumbnail`}
                  className={styles.thumbnail}
                  src={getImageUrl(file)}
                  alt={isAmityFile(file.file) ? file.file.attributes?.name : 'image thumbnail'}
                />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file.file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
