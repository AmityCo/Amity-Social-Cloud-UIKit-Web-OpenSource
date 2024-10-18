import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './ExploreTrendingTitle.module.css';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
}

export function ExploreTrendingTitle({
  pageId = '*',
  componentId = '*',
  titleClassName,
}: TitleProps) {
  const elementId = 'explore_trending_title';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Title
      className={clsx(styles.exploreTrendingTitle, titleClassName)}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Title>
  );
}
