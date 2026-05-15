import React from 'react';
import { useString } from '~/v4/core/localization';
import { Deleted } from '~/v4/icons/Deleted';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './ErrorPostDetail.module.css';

export const ErrorPostDetail = () => {
  const { onBack } = useNavigation();
  const title = useString('amity_social_label_livestream_deleted_page_title');
  const description = useString('amity_social_button_livestream_deleted_page_desc');
  const goBackLabel = useString('amity_social_button_go_back');

  return (
    <section className={styles.errorPostDetail}>
      <Deleted className={styles.errorPostDetail__icon} />
      <Typography.Headline className={styles.errorPostDetail__title}>{title}</Typography.Headline>
      <Typography.Body>{description}</Typography.Body>
      <Button className={styles.errorPostDetail__button} onPress={() => onBack()}>
        {goBackLabel}
      </Button>
    </section>
  );
};
