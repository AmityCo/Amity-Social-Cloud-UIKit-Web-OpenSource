import React from 'react';
import styles from './ModeratorBadge.module.css';
import Badge from '~/v4/icons/Badge';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';

interface ModeratorBadgeProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  type?: 'default' | 'live';
  variant?: 'textWithIcon' | 'iconOnly';
}

export function ModeratorBadge({
  pageId = '*',
  componentId = '*',
  className,
  type = 'default',
  variant = 'textWithIcon',
}: ModeratorBadgeProps) {
  const elementId = 'moderator_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  const badgeClasses = clsx(
    styles.moderatorBadge,
    {
      [styles['moderatorBadge--default']]: type === 'default',
      [styles['moderatorBadge--live']]: type === 'live',
      [styles['moderatorBadge--iconOnly']]: variant === 'iconOnly',
    },
    className,
  );

  return (
    <div className={badgeClasses} style={themeStyles} data-testid={accessibilityId}>
      <Badge className={clsx(styles.moderatorBadge__icon)} />
      {variant === 'textWithIcon' && (
        <Typography.CaptionSmall className={clsx(styles.moderatorBadge__text)}>
          {config.text}
        </Typography.CaptionSmall>
      )}
    </div>
  );
}
