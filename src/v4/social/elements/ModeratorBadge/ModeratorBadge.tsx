import clsx from 'clsx';
import React from 'react';
import Moderator from '~/v4/icons/Moderator';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ModeratorBadge.module.css';

type ModeratorBadgeProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  variant?: 'chat' | 'social';
};

export function ModeratorBadge({
  pageId = '*',
  componentId = '*',
  className,
  variant = 'social',
}: ModeratorBadgeProps) {
  const elementId = 'moderator_badge';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div
      data-variant={variant}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.moderatorBadge, className)}
    >
      <Moderator
        className={styles.moderatorBadge__icon}
        data-variant={variant}
        aria-label="Moderator badge icon"
      />
      <Typography.CaptionSmall className={styles.moderatorBadge__text} data-variant={variant}>
        {config.text}
      </Typography.CaptionSmall>
    </div>
  );
}
