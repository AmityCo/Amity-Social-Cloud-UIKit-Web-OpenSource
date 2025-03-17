import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './MyTimelineText.module.css';

interface MyTimelineTextProps {
  pageId?: string;
  componentId?: string;
}

export function MyTimelineText({ pageId = '*', componentId = '*' }: MyTimelineTextProps) {
  const elementId = 'my_timeline_text';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Body
      className={styles.myTimelineText}
      style={{ ...themeStyles }}
      data-testid={accessibilityId}
    >
      {config.text}
    </Typography.Body>
  );
}
