import React from 'react';
import styles from './LockPrivateContent.module.css';
import Lock from '~/v4/icons/Lock';
import { Typography } from '~/v4/core/components';

export const LockPrivateContent = () => {
  return (
    <div className={styles.lockPrivateContent__wrap}>
      <Lock className={styles.lockPrivateContent__lockIcon} />
      <Typography.Title className={styles.lockPrivateContent__title}>
        This community is private
      </Typography.Title>
      <Typography.Body className={styles.lockPrivateContent__body}>
        Only invited members can see the posts.
      </Typography.Body>
    </div>
  );
};
