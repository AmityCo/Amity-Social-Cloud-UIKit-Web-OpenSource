import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components';
import clsx from 'clsx';
import styles from './SubDescription.module.css';

type SubDescriptionProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
  elementId: string;
  className?: string;
};

export const SubDescription = ({
  className,
  pageId = '*',
  componentId = '*',
  elementId,
  ...props
}: SubDescriptionProps) => {
  const { accessibilityId, themeStyles, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Caption
      {...props}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.subDescription, className)}
    >
      {config.text}
    </Typography.Caption>
  );
};
