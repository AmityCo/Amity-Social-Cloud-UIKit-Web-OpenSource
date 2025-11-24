import React from 'react';
import { Typography, TypographyVariant } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityDisplayName.module.css';
import clsx from 'clsx';

export type CommunityDisplayNameProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  community?: Amity.Community | null;
  typography?: keyof typeof TypographyVariant;
  displayName?: string;
};

export function CommunityDisplayName({
  className,
  community,
  displayName,
  pageId = '*',
  componentId = '*',
  typography = 'BodyBold',
}: CommunityDisplayNameProps) {
  const elementId = 'community_display_name';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const $Typography = Typography[typography];

  if (isExcluded) return null;

  return (
    <$Typography
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.communityDisplayName, className)}
    >
      {displayName ?? community?.displayName ?? 'My Timeline'}
    </$Typography>
  );
}
