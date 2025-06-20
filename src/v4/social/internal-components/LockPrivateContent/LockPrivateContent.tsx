import React from 'react';
import styles from './LockPrivateContent.module.css';
import Lock from '~/v4/icons/Lock';
import { Typography } from '~/v4/core/components';

export const LockPrivateContent = () => {
  return (
    <div className={styles.lockPrivateContent__wrap}>
      <Lock className={styles.lockPrivateContent__lockIcon} />
      <Typography.TitleBold className={styles.lockPrivateContent__title}>
        This community is private
      </Typography.TitleBold>
      <Typography.Body className={styles.lockPrivateContent__body}>
        Join this community to see its content and members.
      </Typography.Body>
    </div>
  );
};
