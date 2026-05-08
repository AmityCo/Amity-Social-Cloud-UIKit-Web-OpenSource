import React from 'react';
import styles from './UserAboutTitle.module.css';
import { Typography } from '~/v4/core/components';
import { Title } from '~/v4/social/internal-components/Title';
import { useString } from '~/v4/core/localization';

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
          textKey="amity_social_label_edit_user_about_title"
        />
        <Typography.Caption className={styles.userAboutTitle__optional__text}>
          {' '}
          {useString('amity_social_label_optional')}
        </Typography.Caption>
      </div>
      <Typography.Caption className={styles.userAboutTitle__length}>
        {length}/{maxLength}
      </Typography.Caption>
    </div>
  );
}
