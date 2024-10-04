import React from 'react';
import { Typography } from '~/v4/core/components/Typography';
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

  const { themeStyles, config, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) {
    return null;
  }

  return (
    <Typography.Title
      style={themeStyles}
      className={styles.communityEmptyTitle}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Title>
  );
};
