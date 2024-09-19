import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './EditPostButton.module.css';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

type EditPostButtonProps = ButtonProps & {
  pageId: string;
  componentId?: string;
};

export function EditPostButton({ pageId = '*', componentId = '*', ...props }: EditPostButtonProps) {
  const elementId = 'edit_post_button';
  const { config, isExcluded, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.editPostButton}
      {...props}
    >
      {config.text}
    </Button>
  );
}
