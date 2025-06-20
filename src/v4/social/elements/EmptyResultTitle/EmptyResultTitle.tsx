import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components';
import styles from './EmptyResultTitle.module.css';

type EmptyResultTitleProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
};

export const EmptyResultTitle = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: EmptyResultTitleProps) => {
  const elementId = 'empty_result_title';
  const { accessibilityId, themeStyles, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      {...props}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.emptyResultTitle, className)}
    >
      {config.text}
    </Typography.TitleBold>
  );
};
