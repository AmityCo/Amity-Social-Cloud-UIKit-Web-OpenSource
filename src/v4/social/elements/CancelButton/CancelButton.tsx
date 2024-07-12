import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CancelButton.module.css';

interface CancelButtonProps {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
}

export const CancelButton = ({
  pageId = '*',
  componentId = '*',
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
      data-qa-anchor={accessibilityId}
      className={styles.cancelButton}
      style={themeStyles}
      onPress={onPress}
    >
      <Typography.Body>{config.text}</Typography.Body>
    </Button>
  );
};
