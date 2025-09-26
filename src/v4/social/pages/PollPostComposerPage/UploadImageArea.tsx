import React from 'react';
import styles from './UploadImageArea.module.css';
import { ImagePreview } from '~/v4/icons/ImagePreview';
import { Typography } from '~/v4/core/components';

export const UploadImageArea = () => {
  return (
    <div className={styles.uploadImageArea}>
      <ImagePreview className={styles.uploadImageArea__icon} />
      <Typography.CaptionBold className={styles.uploadImageArea__text}>
        Upload image
      </Typography.CaptionBold>
    </div>
  );
};
