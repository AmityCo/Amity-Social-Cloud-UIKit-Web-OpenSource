import React from 'react';
import styles from './Title.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { resolveString } from '~/v4/core/localization';
import clsx from 'clsx';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  titleClassName?: string;
  required?: boolean;
  labelText?: string;
  textKey?: string;
}

export function Title({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  titleClassName,
  required = false,
  labelText,
  textKey,
}: TitleProps) {
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
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
      {textKey ? resolveString(textKey) : labelText}
      {required && <span className={styles.title__requiredIndicator}>*</span>}
    </Typography.TitleBold>
  );
}
