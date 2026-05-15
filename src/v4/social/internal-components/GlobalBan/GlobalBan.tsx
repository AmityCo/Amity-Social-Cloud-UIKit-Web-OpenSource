import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import styles from './GlobalBan.module.css';
import { Alert } from '~/v4/icons/Alert';

export const GlobalBan = () => {
  return (
    <div className={styles.globalBan}>
      <Alert className={styles.globalBan__icon} />
      <Typography.TitleBold className={styles.globalBan__text}>
        {useString('amity_social_label_banned_title')}
      </Typography.TitleBold>
      <Typography.Caption className={styles.globalBan__text}>
        {useString('amity_social_banned_message')}
      </Typography.Caption>
    </div>
  );
};
