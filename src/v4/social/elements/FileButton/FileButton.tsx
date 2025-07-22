import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './FileButton.module.css';
import clsx from 'clsx';

interface FileButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const FileButtonSvg = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M16 6.00009L7.58603 14.5861C7.21088 14.9612 7.00012 15.4701 7.00012 16.0006C7.00012 16.5311 7.21088 17.0399 7.58603 17.4151C7.96118 17.7902 8.46999 18.001 9.00053 18.001C9.53107 18.001 10.0399 17.7902 10.415 17.4151L18.829 8.82909C19.5792 8.07893 20.0006 7.06148 20.0006 6.00059C20.0006 4.9397 19.5792 3.92226 18.829 3.17209C18.0789 2.42193 17.0614 2.00049 16.0005 2.00049C14.9396 2.00049 13.9222 2.42193 13.172 3.17209L4.79303 11.7231C4.22843 12.2786 3.77939 12.9403 3.47183 13.6702C3.16426 14.4001 3.00425 15.1837 3.00103 15.9757C2.9978 16.7677 3.15142 17.5526 3.45304 18.285C3.75465 19.0173 4.19828 19.6827 4.75834 20.2428C5.31839 20.8028 5.9838 21.2465 6.71617 21.5481C7.44853 21.8497 8.23337 22.0033 9.02541 22.0001C9.81744 21.9969 10.601 21.8369 11.3309 21.5293C12.0608 21.2217 12.7225 20.7727 13.278 20.2081L21.657 11.6571"
        stroke="#222222"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export function FileButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: FileButtonProps) {
  const elementId = 'file_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.fileButton}
      onClick={() => {}}
    >
      <IconComponent
        defaultIcon={() => (
          <FileButtonSvg className={clsx(styles.fileButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      {config.text && <Typography.BodyBold>{config.text}</Typography.BodyBold>}
    </div>
  );
}
