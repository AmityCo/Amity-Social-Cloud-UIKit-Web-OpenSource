import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityDisplayName.module.css';
import clsx from 'clsx';

export type CommunityDisplayNameProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  community?: Amity.Community | null;
};

export function CommunityDisplayName({
  className,
  community,
  pageId = '*',
  componentId = '*',
}: CommunityDisplayNameProps) {
  const elementId = 'community_display_name';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.BodyBold
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.communityDisplayName, className)}
    >
      {community?.displayName ?? 'My Timeline'}
    </Typography.BodyBold>
  );
}
