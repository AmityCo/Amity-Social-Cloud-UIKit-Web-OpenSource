import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CancelButton.module.css';

type CancelButtonProps = {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
  disabled?: boolean;
};

export const CancelButton = ({
  pageId = '*',
  componentId = '*',
  disabled,
  onPress = () => {},
}: CancelButtonProps) => {
  const elementId = 'cancel_button';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      onPress={onPress}
      style={themeStyles}
      className={styles.cancelButton}
      data-testid={accessibilityId}
      isDisabled={disabled}
    >
      <Typography.Body>{config.text ?? 'Cancel'}</Typography.Body>
    </Button>
  );
};
