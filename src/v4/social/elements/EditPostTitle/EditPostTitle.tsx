import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './EditPostTitle.module.css';

interface EditPostTitleProps {
  pageId: string;
  componentId?: string;
}

export function EditPostTitle({ pageId = '*', componentId = '*' }: EditPostTitleProps) {
  const elementId = 'edit_post_title';
  const { config, isExcluded, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles} className={styles.editPostTitle}>
      {config.text}
    </div>
  );
}
