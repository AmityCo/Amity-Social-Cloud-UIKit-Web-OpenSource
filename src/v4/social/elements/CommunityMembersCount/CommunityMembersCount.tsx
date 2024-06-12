import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityMembersCount.module.css';

import millify from 'millify';

export interface CommunityMembersCountProps {
  pageId?: string;
  componentId?: string;
  memberCount: number;
}

export function CommunityMembersCount({
  pageId = '*',
  componentId = '*',
  memberCount,
}: CommunityMembersCountProps) {
  const elementId = 'community_members_count';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Typography.Caption
      className={styles.communityMembersCount}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >{`${millify(memberCount) || 0} ${
      memberCount !== 1 ? 'members' : 'member'
    }`}</Typography.Caption>
  );
}
