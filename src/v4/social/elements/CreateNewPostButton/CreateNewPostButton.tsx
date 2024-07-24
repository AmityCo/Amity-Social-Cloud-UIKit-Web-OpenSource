import React, { FormEventHandler } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CreateNewPostButton.module.css';

interface CreateNewPostButtonProps {
  pageId: string;
  componentId?: string;
  isValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateNewPostButton({
  pageId = '*',
  componentId = '*',
  isValid,
  onSubmit,
}: CreateNewPostButtonProps) {
  const elementId = 'create_new_post_button';
  const { config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;

  return (
    <button
      onSubmit={onSubmit}
      style={themeStyles}
      disabled={!isValid}
      className={styles.createNewPostButton}
      type="submit"
    >
      {config.text}
    </button>
  );
}
