import React from 'react';
import styles from './CommunityName.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityNameProps {
  name: string;
  pageId?: string;
  componentId?: string;
}

export const CommunityName = ({
  pageId = '*',
  componentId = '*',
  name = '',
}: CommunityNameProps) => {
  const elementId = 'community_name';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Heading data-qa-anchor={accessibilityId} className={styles.communityName__truncate}>
      {name}
    </Typography.Heading>
  );
};
