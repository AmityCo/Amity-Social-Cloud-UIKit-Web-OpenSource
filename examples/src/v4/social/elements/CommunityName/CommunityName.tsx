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
  const { accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Headline data-testid={accessibilityId} className={styles.communityName__truncate}>
      {name}
    </Typography.Headline>
  );
};
