import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './GlobalBan.module.css';
import { Alert } from '~/v4/icons/Alert';

export const GlobalBan = () => {
  return (
    <div className={styles.globalBan}>
      <Alert className={styles.globalBan__icon} />
      <Typography.TitleBold className={styles.globalBan__text}>
        You’ve been banned.
      </Typography.TitleBold>
      <Typography.Caption className={styles.globalBan__text}>
        Based on your previous activities, you account has been banned from all feeds.
      </Typography.Caption>
    </div>
  );
};
