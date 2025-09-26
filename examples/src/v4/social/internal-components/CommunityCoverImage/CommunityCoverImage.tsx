import React from 'react';
import styles from './CommunityCoverImage.module.css';
import { FileRepository } from '@amityco/ts-sdk';
import useFileUpload from '~/v4/social/hooks/useFileUpload';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { useImage } from '~/v4/core/hooks/useImage';

type CommunityCoverImageProps = {
  files: File[];
  uploadedFiles: Amity.File[];
  onChange: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange: (loading: boolean) => void;
  uploadLoading: boolean;
  className?: string;
  avatarFileId?: string;
};

export const CommunityCoverImage = ({
  files,
  uploadedFiles,
  onChange,
  onLoadingChange,
  uploadLoading,
  className,
  avatarFileId,
}: CommunityCoverImageProps) => {
  const { allFiles } = useFileUpload({
    files,
    uploadedFiles,
    onChange,
    onLoadingChange,
  });

  const avatarFileUrl = useImage({ fileId: avatarFileId, imageSize: 'medium' });

  if (allFiles.length === 0 && !avatarFileId) return null;

  return avatarFileId && allFiles.length == 0 ? (
    <img src={avatarFileUrl} alt="cover-image" className={styles.communityCoverImage__image} />
  ) : (
    allFiles && (
      <div>
        {uploadLoading ? (
          <div className={styles.communityCoverImage__spinner}>
            <Spinner />
          </div>
        ) : (
          <img
            src={FileRepository.fileUrlWithSize(
              (allFiles[allFiles.length - 1] as Amity.File)?.fileUrl,
              'medium',
            )}
            alt="cover-image"
            className={styles.communityCoverImage__image}
          />
        )}
      </div>
    )
  );
};
