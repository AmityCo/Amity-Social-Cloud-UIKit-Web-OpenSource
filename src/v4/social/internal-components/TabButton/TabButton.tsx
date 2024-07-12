import React, { ReactNode } from 'react';

import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './TabButton.module.css';

export interface TabButtonProps extends ButtonProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  children: ReactNode;
  isActive?: boolean;
}

export function TabButton({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  children,
  isActive = false,
  ...rest
}: TabButtonProps) {
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  return (
    <Button
      style={themeStyles}
      className={styles.tabButton}
      data-active={isActive}
      data-qa-anchor={accessibilityId}
      {...rest}
    >
      {isActive ? (
        <Typography.Title data-active={isActive} className={styles.tabButton__text}>
          {children}
        </Typography.Title>
      ) : (
        <Typography.Caption data-active={isActive} className={styles.tabButton__text}>
          {children}
        </Typography.Caption>
      )}
    </Button>
  );
}
