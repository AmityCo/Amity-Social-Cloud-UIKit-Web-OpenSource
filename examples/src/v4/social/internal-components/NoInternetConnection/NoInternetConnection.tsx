import React from 'react';
import { NoInternetConnection as NoInternetConnectionIcon } from '~/v4/icons/NoInternetConnection';
import styles from './NoInternetConnection.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import clsx from 'clsx';

export type NoInternetConnectionProps = {
  isShowRetryButton?: boolean;
  className?: string;
  onRetry?: () => void;
};

export const NoInternetConnection = ({
  isShowRetryButton = false,
  onRetry,
  className,
}: NoInternetConnectionProps) => {
  return (
    <div className={clsx(styles.noInternetConnection__container, className)}>
      <NoInternetConnectionIcon className={styles.noInternetConnection__icon} />
      <Typography.TitleBold className={styles.noInternetConnection__title}>
        No internet connection
      </Typography.TitleBold>
      {isShowRetryButton && (
        <Button onPress={onRetry} variant="outlined" className={styles.noInternetConnection__retry}>
          Retry
        </Button>
      )}
    </div>
  );
};
