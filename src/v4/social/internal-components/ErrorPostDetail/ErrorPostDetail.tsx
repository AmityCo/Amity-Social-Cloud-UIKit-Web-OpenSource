import React from 'react';
import { Deleted } from '~/v4/icons/Deleted';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './ErrorPostDetail.module.css';

export const ErrorPostDetail = () => {
  const { onBack } = useNavigation();

  return (
    <section className={styles.errorPostDetail}>
      <Deleted className={styles.errorPostDetail__icon} />
      <Typography.Headline className={styles.errorPostDetail__title}>
        Something went wrong
      </Typography.Headline>
      <Typography.Body>The content you're looking for is unavailable.</Typography.Body>
      <Button className={styles.errorPostDetail__button} onPress={() => onBack()}>
        Go back
      </Button>
    </section>
  );
};
