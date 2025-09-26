import React from 'react';
import styles from './Title.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  titleClassName?: string;
  required?: boolean;
  labelText?: string;
}

export function Title({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  titleClassName,
  required = false,
  labelText,
}: TitleProps) {
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      className={clsx(styles.title, titleClassName)}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {config.text ?? labelText}
      {required && <span className={styles.title__requiredIndicator}>*</span>}
    </Typography.TitleBold>
  );
}
