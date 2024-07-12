import React from 'react';
import styles from './CloseButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

const CloseIconSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 320 512"
    fill="currentColor"
    {...props}
  >
    <path
      d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34
    0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4
    52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4
    256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160
    303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34
    0-22.58L207.6 256z"
    />
  </svg>
);

interface CloseButtonProps {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
  defaultClassName?: string;
  imgClassName?: string;
}

export const CloseButton = ({
  pageId = '*',
  componentId = '*',
  onPress = () => {},
  defaultClassName,
  imgClassName,
}: CloseButtonProps) => {
  const elementId = 'close_button';
  const { isExcluded, config, uiReference, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={styles.closeButton} data-qa-anchor={accessibilityId} onPress={onPress}>
      <IconComponent
        defaultIcon={() => (
          <CloseIconSVG className={clsx(styles.closeButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        configIconName={config.icon}
      />
    </Button>
  );
};
