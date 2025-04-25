import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { NoPage } from '~/v4/icons/NoPage';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './FailedToShow.module.css';

type FailedToShowProps = {
  pageId?: string;
  onBack?: () => void;
};

export const FailedToShow = ({ pageId = '*', onBack }: FailedToShowProps) => {
  const componentId = 'failed_to_show';
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });
  return (
    <div data-testid={accessibilityId} className={styles.failedToShow}>
      <IconComponent
        imgIcon={() => <NoPage className={styles.failedToShow__icon} />}
        defaultIcon={() => <NoPage className={styles.failedToShow__icon} />}
      />
      <Typography.Headline className={styles.failedToShow__title}>
        Something went wrong
      </Typography.Headline>
      <Typography.Body className={styles.failedToShow__desc}>
        The content you’re looking for is unavailable.
      </Typography.Body>
      {onBack && (
        <Button onPress={onBack} className={styles.failedToShow__button}>
          <Typography.Body>Go Back</Typography.Body>
        </Button>
      )}
    </div>
  );
};
