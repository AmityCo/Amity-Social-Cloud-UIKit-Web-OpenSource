import React from 'react';
import { useString } from '~/v4/core/localization';
import styles from './UploadImageArea.module.css';
import { ImagePreview } from '~/v4/icons/ImagePreview';
import { Typography } from '~/v4/core/components';

export const UploadImageArea = () => {
  return (
    <div className={styles.uploadImageArea}>
      <ImagePreview className={styles.uploadImageArea__icon} />
      <Typography.CaptionBold className={styles.uploadImageArea__text}>
        {useString('amity_social_button_poll_upload_image')}
      </Typography.CaptionBold>
    </div>
  );
};
