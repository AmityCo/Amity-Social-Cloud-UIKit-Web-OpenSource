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
        d="M14.9995 7.49951L7.18934 15.4393C6.90804 15.7206 6.75 16.1021 6.75 16.5C6.75 16.8978 6.90804 17.2793 7.18934 17.5606C7.47064 17.8419 7.85218 18 8.25 18C8.64783 18 9.02936 17.8419 9.31066 17.5606L18.6208 8.12083C18.8993 7.84226 19.1203 7.51154 19.2711 7.14756C19.4219 6.78359 19.4995 6.39348 19.4995 5.99951C19.4995 5.60555 19.4219 5.21544 19.2711 4.85146C19.1203 4.48748 18.8993 4.15677 18.6208 3.87819C18.3422 3.59962 18.0115 3.37864 17.6475 3.22787C17.2835 3.07711 16.8934 2.99951 16.4995 2.99951C16.1055 2.99951 15.7154 3.07711 15.3514 3.22787C14.9874 3.37864 14.6567 3.59962 14.3781 3.87819L5.06802 13.318C4.22411 14.1619 3.75 15.3065 3.75 16.5C3.75 17.6934 4.22411 18.838 5.06802 19.682C5.91193 20.5259 7.05653 21 8.25 21C9.44348 21 10.5881 20.5259 11.432 19.682L19.1245 11.9995"
        stroke={props.stroke}
        stroke-width="1.3"
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
      data-qa-anchor={accessibilityId}
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
