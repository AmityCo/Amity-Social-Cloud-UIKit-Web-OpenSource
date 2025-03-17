import React from 'react';
import styles from './VideoThumbnail.module.css';
import useFileUpload from '~/v4/social/hooks/useFileUpload';
import clsx from 'clsx';
import { CloseIcon, ExclamationCircle, Play } from '~/icons';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { Button } from '~/v4/core/natives/Button';

interface VideoThumbnailProps {
  pageId?: string;
  componentId?: string;
  files: File[];
  uploadedFiles: Amity.File[];
  onLoadingChange: (loading: boolean) => void;
  onChange: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  uploadLoading: boolean;
  onError: (message: string) => void;
  videoThumbnail?: { file: File; videoUrl: string; thumbnail: string | undefined }[];
  removeThumbnail: (index: number) => void;
  isErrorUpload?: string;
}

export const VideoThumbnail = ({
  pageId = '*',
  componentId = '*',
  files,
  uploadedFiles,
  onLoadingChange,
  onChange,
  uploadLoading,
  onError,
  videoThumbnail,
  removeThumbnail,
  isErrorUpload,
}: VideoThumbnailProps) => {
  const useFileUploadProps = useFileUpload({
    files,
    uploadedFiles,
    onChange,
    onLoadingChange,
    onError,
  });

  const { allFiles, removeFile } = useFileUploadProps;

  if (allFiles.length === 0) return null;

  const handleRemoveThumbnail = (file: File, index: number) => {
    removeFile(file, index);
    removeThumbnail(index);
  };

  if (!videoThumbnail) return null;
  return (
    <div
      data-images-amount={Math.min(videoThumbnail.length, 3)}
      className={styles.thumbnail__container}
    >
      {videoThumbnail?.map((file, index) => (
        <div
          key={file.videoUrl}
          className={clsx(
            styles.thumbnail__wrapper,
            videoThumbnail.length > 2 && styles.thumbnail__wrapper_item_3,
          )}
        >
          {uploadLoading ? (
            <>
              <img src={file.thumbnail} className={styles.thumbnail} alt="thumbnail-video" />
              <div className={styles.thumbnail__overlay} />
              <div className={styles.icon__status}>
                <Spinner />
              </div>
            </>
          ) : isErrorUpload ? (
            <>
              <Button
                data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                type="reset"
                className={styles.closeButton}
                onPress={() => handleRemoveThumbnail(file.file, index)}
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
                src={file.thumbnail}
              />
              <Button
                data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                type="reset"
                className={styles.closeButton}
                onPress={() => handleRemoveThumbnail(file.file, index)}
              >
                <CloseIcon className={styles.closeIcon} />
              </Button>
              <div className={styles.playIcon}>
                <Play />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
