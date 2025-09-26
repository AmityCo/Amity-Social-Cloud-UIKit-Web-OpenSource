import React from 'react';
import styles from './EmptyUserFeed.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import EmptyPost from '~/v4/icons/EmptyPost';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';

interface EmptyUserFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyUserFeed = ({ pageId = '*', componentId = '*' }: EmptyUserFeedProps) => {
  const elementId = 'empty_user_feed';
  const { config, defaultConfig, isExcluded, themeStyles, accessibilityId, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      defaultIcon={() => <EmptyPost className={styles.emptyUserFeed__icon} />}
    />
  );
};
