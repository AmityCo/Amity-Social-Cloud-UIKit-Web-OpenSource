import React, { useState } from 'react';
import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';
import { CloseIcon, ExclamationCircle, Play } from '~/icons';
import { Button } from '~/v4/core/natives/Button';
import { ProgressSpinner } from '~/v4/social/internal-components/ProgressSpinner';
import { isAmityFile } from '~/v4/utils/checkFileType';
import { useImage } from '~/v4/core/hooks/useImage';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge';
import { useProductTagSelection } from '~/v4/social/features/product-tagged/hooks';
import styles from './VideoThumbnail.module.css';

const PostVideoThumbnail = ({
  post,
  pageId,
  componentId,
  onRemovePostVideo,
  totalVideos,
}: {
  post: Amity.Post<'video'>;
  pageId: string;
  componentId: string;
  onRemovePostVideo?: (fileId: string) => void;
  totalVideos: number;
}) => {
  const thumbnailUrl = useImage({ fileId: post.data?.thumbnailFileId });

  if (!thumbnailUrl) return null;

  return (
    <div key={`post-${post.data?.videoFileId?.original}`} className={styles.thumbnail__wrapper}>
      <img src={thumbnailUrl} className={styles.thumbnail} alt="video thumbnail uploaded" />
      <Button
        data-testid={`${pageId}/${componentId}/remove_thumbnail`}
        type="reset"
        className={styles.closeButton}
        onPress={() =>
          post.data?.videoFileId?.original && onRemovePostVideo?.(post.data.videoFileId.original)
        }
      >
        <CloseIcon className={styles.closeIcon} />
      </Button>
      <div className={styles.playIcon}>
        <Play />
      </div>
    </div>
  );
};

interface VideoThumbnailProps {
  pageId?: string;
  componentId?: string;
  progress: { [key: string]: number };
  files: TFileItem[];
  removeFile: (file: File | Amity.File, index?: number) => void;
  postVideos?: Amity.Post<'video'>[];
  onRemovePostVideo?: (fileId: string) => void;
  onProductTagsChange?: (file: Amity.File<'video'>, productTags: Amity.ProductTag[]) => void;
  productTagsReachLimit?: boolean;
}

export const VideoThumbnail = ({
  pageId = '*',
  componentId = '*',
  progress,
  removeFile,
  files,
  postVideos = [],
  onRemovePostVideo,
  onProductTagsChange,
  productTagsReachLimit = false,
}: VideoThumbnailProps) => {
  const [isBrokenImg, setIsBrokenImg] = useState(false);
  const { openProductTagSelection } = useProductTagSelection<'video'>({
    pageId,
    onProductTagsChange,
  });

  const handleProductTagClick = (file: TFileItem) => {
    if (!isAmityFile(file.file)) return;
    openProductTagSelection(file.file as Amity.File<'video'>, file.productTags);
  };

  const isVideoFile = (file: TFileItem) => {
    if (isAmityFile(file.file)) {
      return (
        file.file.type === 'video' || (file.file.attributes?.mimeType || '').startsWith('video/')
      );
    } else if (file.file instanceof File) {
      return file.file.type.startsWith('video/');
    }
    return false;
  };

  // Process videos first
  const hasNewVideos = files.length > 0 && files.some((file) => isVideoFile(file));
  const hasPostVideos = postVideos.length > 0;

  // Calculate total videos for layout
  const totalVideos =
    (hasNewVideos ? files.filter((file) => isVideoFile(file)).length : 0) +
    (hasPostVideos ? postVideos.length : 0);

  if (!hasNewVideos && !hasPostVideos) return null;

  return (
    <div data-images-amount={Math.min(totalVideos, 3)} className={styles.thumbnail__container}>
      {/* Render existing post videos using the extracted component */}
      {postVideos.map((post) => (
        <PostVideoThumbnail
          key={post.data?.videoFileId.original}
          post={post}
          pageId={pageId}
          componentId={componentId}
          onRemovePostVideo={onRemovePostVideo}
          totalVideos={totalVideos}
        />
      ))}

      {/* Render new video uploads */}
      {files
        ?.filter((file) => isVideoFile(file))
        .map((file) => (
          <div key={`file-${file.id}`} className={styles.thumbnail__wrapper}>
            {progress[file.id] && !isAmityFile(file.file) ? (
              <>
                <img src={file.thumbnailVideo} className={styles.thumbnail} alt="thumbnail-video" />
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
            ) : file.errorText ? (
              <>
                {isBrokenImg || !file.thumbnailVideo ? (
                  <div className={styles.thumbnailVideo__broken} />
                ) : (
                  <img
                    src={file.thumbnailVideo}
                    className={styles.thumbnail}
                    alt="thumbnail-video"
                    onError={() => setIsBrokenImg(true)}
                  />
                )}

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
                  <ExclamationCircle />
                </div>
              </>
            ) : (
              <>
                <img
                  data-testid={`${pageId}/${componentId}/video_thumbnail`}
                  className={styles.thumbnail}
                  alt={isAmityFile(file.file) ? file.file.attributes?.name : 'video thumbnail'}
                  src={file.thumbnailVideo}
                />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file.file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
                <div className={styles.playIcon}>
                  <Play />
                </div>
                {onProductTagsChange &&
                  ((file.productTags ?? [])?.length !== 0 || !productTagsReachLimit) &&
                  isAmityFile(file.file) && (
                    <div className={styles.thumbnail__productTagBadge}>
                      <ProductTagBadge
                        selectedProductTags={file.productTags ?? []}
                        onClick={() => handleProductTagClick(file)}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
        ))}
    </div>
  );
};
