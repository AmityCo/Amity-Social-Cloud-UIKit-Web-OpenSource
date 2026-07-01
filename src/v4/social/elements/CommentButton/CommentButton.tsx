import type React from 'react';

import clsx from 'clsx';

import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, type ButtonProps } from '~/v4/core/natives/Button';

import styles from './CommentButton.module.css';

const CommentSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="comment"
    {...props}
  >
    <g clip-path="url(#clip0_822_19429)">
      <path
        d="M14 4.49349C13.9999 3.65624 13.4155 2.95325 12.6224 2.83659C11.1141 2.61484 9.57046 2.5 8 2.5C6.42947 2.50001 4.88597 2.61481 3.3776 2.83659C2.58455 2.95324 2.00013 3.65626 2 4.49349V8.50651C2.00013 9.34374 2.58455 10.0468 3.3776 10.1634C4.0903 10.2682 4.81093 10.3487 5.53841 10.4049C5.7988 10.4251 5.99994 10.6425 6 10.9036V12.793L7.86393 10.929C8.14035 10.6527 8.51102 10.4983 8.89518 10.4876C10.1577 10.4524 11.4016 10.3429 12.6224 10.1634C13.4155 10.0468 13.9999 9.34377 14 8.50651V4.49349ZM15 8.50651C14.9999 9.80383 14.0864 10.9591 12.7676 11.153C11.508 11.3382 10.2251 11.4507 8.92318 11.487C8.78787 11.4908 8.66204 11.545 8.57096 11.6361L5.85352 14.3535C5.71053 14.4965 5.49542 14.5396 5.30859 14.4622C5.12176 14.3848 5 14.2022 5 14V11.3626C4.40608 11.3083 3.81673 11.2383 3.23242 11.1523C1.91364 10.9584 1.00013 9.80379 1 8.50651V4.49349C1.00013 3.19621 1.91363 2.04156 3.23242 1.84766C4.78876 1.61883 6.38067 1.50001 8 1.5C9.61923 1.5 11.2113 1.61821 12.7676 1.84701C14.0864 2.0409 14.9999 3.19617 15 4.49349V8.50651Z"
        fill="#888582"
      />
    </g>
    <defs>
      <clipPath id="clip0_822_19429">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface CommentButtonProps {
  pageId?: string;
  componentId?: string;
  commentsCount?: number;
  className?: string;
  buttonClassName?: string;
  commentsCountClassName?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress?: ButtonProps['onPress'];
}

export function CommentButton({
  pageId = '*',
  componentId = '*',
  commentsCount = 0,
  buttonClassName,
  defaultIconClassName,
  imgIconClassName,
  commentsCountClassName,
  onPress = () => {},
}: CommentButtonProps) {
  const elementId = 'comment_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button onPress={onPress} data-testid={accessibilityId}>
      <IconComponent
        defaultIcon={() => (
          <div className={clsx(styles.commentButton, buttonClassName)}>
            <Typography
              data-testid={`${pageId}/${componentId}/comment_count`}
              className={clsx(styles.commentButton__text, commentsCountClassName)}
            >
              {commentsCount}
            </Typography>
            <CommentSvg className={clsx(styles.commentButton__icon, defaultIconClassName)} />
            <Typography className={clsx(styles.commentButton__text, commentsCountClassName)}>
              Comment
            </Typography>
          </div>
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
