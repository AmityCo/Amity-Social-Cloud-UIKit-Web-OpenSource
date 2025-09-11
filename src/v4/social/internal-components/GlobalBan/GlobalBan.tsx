import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './GlobalBan.module.css';
import { Alert } from '~/v4/icons/Alert';

export const GlobalBan = () => {
  return (
    <div className={styles.globalBan}>
      <Alert className={styles.globalBan__icon} />
      <Typography.TitleBold className={styles.globalBan__text}>Account Banned</Typography.TitleBold>
      <Typography.Caption className={styles.globalBan__text}>
        Your community account has been banned due to multiple violations of our Community
        Guidelines.
      </Typography.Caption>
    </div>
  );
};
