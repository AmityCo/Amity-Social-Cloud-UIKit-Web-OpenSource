import React, { ComponentProps } from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { NoResultIcon } from '~/v4/icons/NoResult';
import styles from './EmptySearchResult.module.css';

type EmptySearchResultProps = ComponentProps<'div'>;

export const EmptySearchResult = (props: EmptySearchResultProps) => {
  return (
    <div className={styles.emptySearchResult} {...props}>
      <NoResultIcon className={styles.emptySearchResult__icon} />
      <Typography.TitleBold className={styles.emptySearchResult__text}>
        {useString('amity_social_label_no_results_found')}
      </Typography.TitleBold>
    </div>
  );
};
