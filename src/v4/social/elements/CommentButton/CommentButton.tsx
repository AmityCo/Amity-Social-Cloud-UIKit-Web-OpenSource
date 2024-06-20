import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './CommentButton.module.css';

const CommentSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9 0.1875C13.6816 0.1875 17.4668 3.30859 17.4668 7.09375C17.4668 10.9121 13.6816 14 9 14C7.9043 14 6.8418 13.834 5.91211 13.5352C4.91602 14.2324 3.32227 15.0625 1.29688 15.0625C0.964844 15.0625 0.666016 14.8965 0.533203 14.5977C0.433594 14.2988 0.466797 13.9668 0.699219 13.7344C0.732422 13.7344 1.76172 12.6055 2.22656 11.3105C1.13086 10.1484 0.5 8.6875 0.5 7.09375C0.5 3.30859 4.28516 0.1875 9 0.1875ZM9 12.4062C12.7852 12.4062 15.9062 10.0488 15.9062 7.09375C15.9062 4.17188 12.7852 1.78125 9 1.78125C5.18164 1.78125 2.09375 4.17188 2.09375 7.09375C2.09375 8.52148 2.79102 9.58398 3.38867 10.2148L4.08594 10.9453L3.7207 11.875C3.55469 12.3398 3.32227 12.8047 3.05664 13.2031C3.85352 12.9375 4.51758 12.5723 4.98242 12.2402L5.61328 11.7754L6.37695 12.0078C7.20703 12.2734 8.10352 12.4062 9 12.4062Z" />
  </svg>
);

interface CommentButtonProps {
  pageId?: string;
  componentId?: string;
  commentsCount?: number;
  className?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function CommentButton({
  pageId = '*',
  componentId = '*',
  commentsCount,
  className = '',
  defaultIconClassName,
  imgIconClassName,
  onClick = () => {},
}: CommentButtonProps) {
  const elementId = 'comment_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      className={clsx(className)}
      data-qa-anchor={accessibilityId}
      onClick={onClick}
      defaultIcon={() => (
        <div className={clsx(styles.commentButton)}>
          <CommentSvg className={clsx(styles.commentButton__icon, defaultIconClassName)} />
          <Typography.BodyBold className={styles.commentButton__text}>
            {typeof commentsCount === 'number' ? commentsCount : config.text}
          </Typography.BodyBold>
        </div>
      )}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
