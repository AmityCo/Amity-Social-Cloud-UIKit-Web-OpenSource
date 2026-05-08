import React from 'react';
import { useString } from '~/v4/core/localization';
import styles from './LockPrivateContent.module.css';
import Lock from '~/v4/icons/Lock';
import { Typography } from '~/v4/core/components';

export const LockPrivateContent = () => {
  return (
    <div className={styles.lockPrivateContent__wrap}>
      <Lock className={styles.lockPrivateContent__lockIcon} />
      <Typography.TitleBold className={styles.lockPrivateContent__title}>
        {useString('amity_social_label_this_community_is_private')}
      </Typography.TitleBold>
      <Typography.Body className={styles.lockPrivateContent__body}>
        {useString('amity_social_label_join_this_community_to_see_its_content_and_members')}
      </Typography.Body>
    </div>
  );
};
