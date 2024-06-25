import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ImageButton.module.css';
import clsx from 'clsx';

interface ImageButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ImageButtonSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M20.25 4.5H3.75C3.33579 4.5 3 4.83579 3 5.25V18.75C3 19.1642 3.33579 19.5 3.75 19.5H20.25C20.6642 19.5 21 19.1642 21 18.75V5.25C21 4.83579 20.6642 4.5 20.25 4.5Z"
        stroke={props.stroke}
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 15.7499L7.71966 11.0302C7.7893 10.9606 7.87198 10.9053 7.96297 10.8676C8.05397 10.8299 8.1515 10.8105 8.24999 10.8105C8.34848 10.8105 8.44601 10.8299 8.537 10.8676C8.62799 10.9053 8.71067 10.9606 8.78032 11.0302L12.9697 15.2196C13.0393 15.2892 13.122 15.3444 13.213 15.3821C13.304 15.4198 13.4015 15.4392 13.5 15.4392C13.5985 15.4392 13.696 15.4198 13.787 15.3821C13.878 15.3444 13.9607 15.2892 14.0303 15.2196L15.9697 13.2802C16.0393 13.2106 16.122 13.1553 16.213 13.1176C16.304 13.0799 16.4015 13.0605 16.5 13.0605C16.5985 13.0605 16.696 13.0799 16.787 13.1176C16.878 13.1553 16.9607 13.2106 17.0303 13.2802L21 17.2499"
        stroke={props.stroke}
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M14.625 10.5C15.2463 10.5 15.75 9.99632 15.75 9.375C15.75 8.75368 15.2463 8.25 14.625 8.25C14.0037 8.25 13.5 8.75368 13.5 9.375C13.5 9.99632 14.0037 10.5 14.625 10.5Z" />
    </svg>
  );
};

export function ImageButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: ImageButtonProps) {
  const elementId = 'image_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.imageButton}
      onClick={() => {}}
    >
      <IconComponent
        defaultIcon={() => (
          <ImageButtonSvg className={clsx(styles.imageButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      <Typography.BodyBold className={styles.imageButton__text}>{config.text}</Typography.BodyBold>
    </div>
  );
}
