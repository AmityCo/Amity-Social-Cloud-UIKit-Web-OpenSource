import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components';
import styles from './NoResultTitle.module.css';

type NoResultTitleProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
};

export const NoResultTitle = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: NoResultTitleProps) => {
  const elementId = 'no_result_title';
  const { accessibilityId, themeStyles, config, isExcluded, resolveText } = useAmityElement({
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
      className={clsx(styles.noResultTitle, className)}
    >
      {resolveText('amity_social_label_no_results_found')}
    </Typography.TitleBold>
  );
};
