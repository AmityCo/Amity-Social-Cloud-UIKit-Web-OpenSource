import React from 'react';
import styles from './UserAboutTitle.module.css';
import { Typography } from '~/v4/core/components';
import { Title } from '~/v4/social/internal-components/Title';

interface UserAboutTitleProps {
  pageId?: string;
  componentId?: string;
  length?: number;
  maxLength?: number;
}

export function UserAboutTitle({
  pageId = '*',
  componentId = '*',
  length = 0,
  maxLength = 180,
}: UserAboutTitleProps) {
  const elementId = 'user_about_title';
  return (
    <div className={styles.userAboutTitle}>
      <div>
        <Title
          pageId={pageId}
          componentId={componentId}
          elementId={elementId}
          titleClassName={styles.userAboutTitle__title}
        />
        <Typography.Caption className={styles.userAboutTitle__optional__text}>
          {' (Optional)'}
        </Typography.Caption>
      </div>
      <Typography.Caption className={styles.userAboutTitle__length}>
        {length}/{maxLength}
      </Typography.Caption>
    </div>
  );
}
