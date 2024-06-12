import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './CommunityDisplayName.module.css';

export interface CommunityDisplayNameProps {
  pageId?: string;
  componentId?: string;
  community: Amity.Community;
}

export function CommunityDisplayName({
  pageId = '*',
  componentId = '*',
  community,
}: CommunityDisplayNameProps) {
  const elementId = 'community_display_name';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Typography.BodyBold
      className={styles.communityDisplayName}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {community.displayName}
    </Typography.BodyBold>
  );
}
