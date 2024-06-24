import React from 'react';
import styles from './Title.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
}

export function Title({ pageId = '*', componentId = '*', titleClassName }: TitleProps) {
  const elementId = 'title';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Title
      className={clsx(styles.title, titleClassName)}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Title>
  );
}
