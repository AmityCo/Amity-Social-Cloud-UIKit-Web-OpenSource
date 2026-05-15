import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
import React, { ComponentProps } from 'react';
import { Typography } from '~/v4/core/components';
import { SearchResult } from '~/v4/icons/SearchResult';
import styles from './LimitCharacterSearch.module.css';

type LimitCharacterSearchProps = ComponentProps<'div'> & {
  pageId?: string;
  componentId?: string;
};

export const LimitCharacterSearch = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: LimitCharacterSearchProps) => {
  return (
    <div {...props} className={clsx(styles.limitCharacterSearch, className)}>
      <SearchResult className={styles.limitCharacterSearch__icon} />
      <Typography.TitleBold className={styles.limitCharacterSearch__text}>
        {useString('amity_social_placeholder_community_search_placeholder')}
      </Typography.TitleBold>
    </div>
  );
};
