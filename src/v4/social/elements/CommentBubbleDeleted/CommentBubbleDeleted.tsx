import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './CommentBubbleDeleted.module.css';

const CommentBubbleDeletedSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M4.375 8.875A.361.361 0 014 8.5v-1a.38.38 0 01.375-.375h7.25c.188 0 .375.188.375.375v1a.38.38 0 01-.375.375h-7.25zM15.75 8A7.749 7.749 0 018 15.75 7.749 7.749 0 01.25 8 7.749 7.749 0 018 .25 7.749 7.749 0 0115.75 8zm-1.5 0c0-3.438-2.813-6.25-6.25-6.25A6.248 6.248 0 001.75 8 6.228 6.228 0 008 14.25 6.248 6.248 0 0014.25 8z"></path>
  </svg>
);

interface CommentBubbleDeletedProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
}

export function CommentBubbleDeleted({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
}: CommentBubbleDeletedProps) {
  const elementId = 'comment_bubble_deleted_view';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => (
        <div className={styles.commentBubbleDeleted__container} data-qa-anchor={accessibilityId}>
          <CommentBubbleDeletedSvg
            className={clsx(styles.commentBubbleDeleted__icon, defaultIconClassName)}
          />
          <Typography.Caption>{config.text}</Typography.Caption>
        </div>
      )}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
