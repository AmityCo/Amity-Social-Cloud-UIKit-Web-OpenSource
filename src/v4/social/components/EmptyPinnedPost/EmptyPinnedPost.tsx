import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import styles from './EmptyPinnedPost.module.css';
import EmptyPost from '~/v4/icons/EmptyPost';
import { useString } from '~/v4/core/localization';

interface EmptyPinnedPostProps {
  pageId?: string;
}

export const EmptyPinnedPost = ({ pageId = '*' }: EmptyPinnedPostProps) => {
  const componentId = 'empty_pinned_post';
  const { config, accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  if (isExcluded) return null;
  return (
    <div
      data-testid={accessibilityId}
      className={styles.emptyPinnedPost__container}
      style={themeStyles}
    >
      <EmptyPost className={styles.emptyPinnedPost__icon} />
      <Typography.TitleBold className={styles.emptyPinnedPost__text}>
        {useString('amity_social_label_no_pinned_posts_yet')}
      </Typography.TitleBold>
    </div>
  );
};
