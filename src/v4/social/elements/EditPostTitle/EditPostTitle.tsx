import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './EditPostTitle.module.css';

interface EditPostTitleProps {
  pageId: string;
  componentId?: string;
}

export function EditPostTitle({ pageId = '*', componentId = '*' }: EditPostTitleProps) {
  const elementId = 'edit_post_title';
  const { config, isExcluded, themeStyles, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.editPostTitle}>
      {resolveText('amity_social_button_edit_post')}
    </div>
  );
}
