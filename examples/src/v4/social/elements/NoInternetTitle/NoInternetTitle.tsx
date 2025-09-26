import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components';
import styles from './NoInternetTitle.module.css';

type NoInternetTitleProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
};

export const NoInternetTitle = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: NoInternetTitleProps) => {
  const elementId = 'no_internet_title';
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
      className={clsx(styles.noInternetTitle, className)}
    >
      {config.text}
    </Typography.TitleBold>
  );
};
