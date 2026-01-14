import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { NoPage } from '~/v4/icons/NoPage';
import { Button } from '~/v4/core/components/AriaButton';
import clsx from 'clsx';
import styles from './FailedToShow.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type FailedToShowProps = {
  pageId?: string;
  className?: string;
};

export const FailedToShow = ({ pageId = '*', className }: FailedToShowProps) => {
  const componentId = 'failed_to_show';
  const { onBack } = useNavigation();
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });
  return (
    <div data-testid={accessibilityId} className={clsx(styles.failedToShow, className)}>
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
      <Button onPress={() => onBack()} className={styles.failedToShow__button}>
        <Typography.Body>Go Back</Typography.Body>
      </Button>
    </div>
  );
};
