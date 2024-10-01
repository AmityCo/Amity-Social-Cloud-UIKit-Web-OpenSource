import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import styles from './CreateNewPostButton.module.css';

interface CreateNewPostButtonProps {
  pageId: string;
  componentId?: string;
  isValid: boolean;
  onSubmit: () => void;
}

export function CreateNewPostButton({
  pageId = '*',
  componentId = '*',
  isValid,
  onSubmit,
}: CreateNewPostButtonProps) {
  const elementId = 'create_new_post_button';
  const { config, isExcluded, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;

  return (
    <Button
      onPress={onSubmit}
      style={themeStyles}
      isDisabled={!isValid}
      className={styles.createNewPostButton}
      type="submit"
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Button>
  );
}
