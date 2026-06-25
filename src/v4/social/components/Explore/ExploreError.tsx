import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';

import styles from './ExploreError.module.css';
import { ExploreErrorGraphic } from '~/v4/icons/ExploreErrorGraphic';

export const ExploreError = () => {
  return (
    <div className={styles.exploreError}>
      <ExploreErrorGraphic />
      <div className={styles.exploreError__text}>
        <Typography.TitleBold>
          {useString('amity_social_label_livestream_deleted_page_title')}
        </Typography.TitleBold>
        <Typography.Caption>{useString('amity_social_label_please_try_again')}</Typography.Caption>
      </div>
    </div>
  );
};
