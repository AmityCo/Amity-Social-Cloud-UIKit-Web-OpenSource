import React from 'react';
import styles from './ImageThumbnail.module.css';
import { CloseIcon, ExclamationCircle } from '~/icons';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import useFileUpload from '~/v4/social/hooks/useFileUpload';
import { FileRepository } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/natives/Button';

interface ImageThumbnailProps {
  pageId?: string;
  componentId?: string;
  files: File[];
  uploadedFiles: Amity.File[];
  onChange: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange: (loading: boolean) => void;
  uploadLoading: boolean;
  onError: (message: string) => void;
  isErrorUpload?: string;
  onUploadFailed?: (message: string) => void;
}

export function ImageThumbnail({
  pageId = '*',
  componentId = '*',
  files,
  uploadedFiles,
  onChange,
  onLoadingChange,
  uploadLoading,
  onError,
  isErrorUpload,
}: ImageThumbnailProps) {
  const useFileUploadProps = useFileUpload({
    files,
    uploadedFiles,
    onChange,
    onLoadingChange,
    onError,
  });

  const { allFiles, removeFile } = useFileUploadProps;

  if (allFiles.length === 0) return null;

  const getImageUrl = (file: File | Amity.File) => {
    return 'fileUrl' in file
      ? FileRepository.fileUrlWithSize(file.fileUrl, 'medium')
      : URL.createObjectURL(file);
  };

  return (
    allFiles && (
      <div
        data-images-amount={Math.min(allFiles.length, 3)}
        className={styles.thumbnail__container}
      >
        {allFiles?.map((file, index: number) => (
          <div
            key={index}
            data-images-height={allFiles.length > 2}
            className={styles.thumbnail__wrapper}
          >
            {uploadLoading ? (
              <>
                <img src={getImageUrl(file)} className={styles.thumbnail} alt="" />
                <div className={styles.thumbnail__overlay} />
                <div className={styles.icon__status}>
                  <Spinner />
                </div>
              </>
            ) : isErrorUpload && !('fileId' in file) ? (
              <>
                <img src={URL.createObjectURL(file as File)} className={styles.thumbnail} alt="" />
                <div className={styles.thumbnail__overlay} />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file)}
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
                  src={FileRepository.fileUrlWithSize((file as Amity.File)?.fileUrl, 'medium')}
                  alt={(file as Amity.File).attributes?.name}
                />
                <Button
                  data-testid={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    )
  );
}
