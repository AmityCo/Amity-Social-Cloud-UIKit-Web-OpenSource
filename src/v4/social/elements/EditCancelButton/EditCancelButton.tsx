import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './EditCancelButton.module.css';

interface EditCancelButtonProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  onPress?: ButtonProps['onPress'];
}

export const EditCancelButton = ({
  pageId = '*',
  componentId = '*',
  className,
  onPress = () => {},
}: EditCancelButtonProps) => {
  const elementId = 'edit_cancel_button';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      className={clsx(styles.editCancelButton, className)}
      style={{
        ...themeStyles,
        backgroundColor: config.background_color as string | undefined,
      }}
      onPress={onPress}
    >
      <Typography.Body>{config.cancel_button_text}</Typography.Body>
    </Button>
  );
};
