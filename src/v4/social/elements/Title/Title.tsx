import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './Title.module.css';

type TitleProps = {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
};

export function Title({ pageId = '*', componentId = '*', titleClassName }: TitleProps) {
  const elementId = 'title';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.title, titleClassName)}
    >
      {config.text}
    </Typography.TitleBold>
  );
}
