import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './OverflowMenuButton.module.css';

const OverflowMenuSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#fff"
        d="M13.688 12.25c0 .95-.774 1.688-1.688 1.688-.95 0-1.688-.739-1.688-1.688 0-.914.739-1.688 1.688-1.688a1.71 1.71 0 011.688 1.688zm4.218-1.688c.914 0 1.688.774 1.688 1.688 0 .95-.774 1.688-1.688 1.688-.949 0-1.687-.739-1.687-1.688 0-.914.738-1.688 1.687-1.688zm-11.812 0c.914 0 1.687.774 1.687 1.688 0 .95-.773 1.688-1.687 1.688-.95 0-1.688-.739-1.688-1.688 0-.914.739-1.688 1.688-1.688z"
      ></path>
    </svg>
  );
};

interface OverflowMenuButtonProps {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
  defaultClassName?: string;
  imgClassName?: string;
  'data-qa-anchor'?: string;
}

export const OverflowMenuButton = ({
  pageId = '*',
  componentId = '*',
  onPress = () => {},
  defaultClassName,
  imgClassName,
}: OverflowMenuButtonProps) => {
  const elementId = 'overflow_menu';
  const { config, defaultConfig, uiReference, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.overflowMenuIcon}
      onPress={onPress}
    >
      <IconComponent
        defaultIcon={() => <OverflowMenuSvg className={defaultClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
