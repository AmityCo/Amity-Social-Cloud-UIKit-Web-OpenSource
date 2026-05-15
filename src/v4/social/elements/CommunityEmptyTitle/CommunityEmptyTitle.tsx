import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityEmptyTitle.module.css';

interface CommunityEmptyTitleProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityEmptyTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityEmptyTitleProps) => {
  const elementId = 'community_empty_title';

  const { themeStyles, config, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) {
    return null;
  }

  return (
    <Typography.TitleBold
      style={themeStyles}
      className={styles.communityEmptyTitle}
      data-testid={accessibilityId}
    >
      {resolveText('amity_social_label_no_community_yet_2')}
    </Typography.TitleBold>
  );
};
