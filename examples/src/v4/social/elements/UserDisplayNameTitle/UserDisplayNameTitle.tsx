import React from 'react';
import styles from './UserDisplayNameTitle.module.css';
import { Typography } from '~/v4/core/components';
import { Title } from '~/v4/social/internal-components/Title';

interface UserDisplayNameTitleProps {
  pageId?: string;
  componentId?: string;
  length?: number;
  maxLength?: number;
}

export function UserDisplayNameTitle({
  pageId = '*',
  componentId = '*',
  length = 0,
  maxLength = 100,
}: UserDisplayNameTitleProps) {
  const elementId = 'user_display_name_title';

  return (
    <div className={styles.userDisplayNameTitle}>
      <Title pageId={pageId} componentId={componentId} elementId={elementId} />
      <Typography.Caption className={styles.userDisplayNameTitle__length}>
        {length}/{maxLength}
      </Typography.Caption>
    </div>
  );
}
