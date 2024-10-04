import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './ExploreCreateCommunity.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Plus } from '~/v4/icons/Plus';
import { Button } from '~/v4/core/natives/Button';

interface DescriptionProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export function ExploreCreateCommunity({
  pageId = '*',
  componentId = '*',
  onClick,
}: DescriptionProps) {
  const elementId = 'explore_create_community';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      className={styles.exploreCreateCommunityButton}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      onPress={onClick}
    >
      <Plus className={styles.exploreCreateCommunityButton__icon} />
      <Typography.BodyBold className={styles.exploreCreateCommunityButton__text}>
        {config.text}
      </Typography.BodyBold>
    </Button>
  );
}
