import React from 'react';
import styles from './ErrorContent.module.css';
import ErrorFeed from '~/v4/icons/ErrorFeed';

import { Typography } from '~/v4/core/components';

export const ErrorContent = () => {
  return (
    <div className={styles.errorContent__container}>
      <ErrorFeed className={styles.errorContent__icon} />
      <div className={styles.errorContent__text}>
        <Typography.TitleBold>Something went wrong</Typography.TitleBold>
        <Typography.Caption>We couldn’t recognize this feed.</Typography.Caption>
      </div>
    </div>
  );
};
