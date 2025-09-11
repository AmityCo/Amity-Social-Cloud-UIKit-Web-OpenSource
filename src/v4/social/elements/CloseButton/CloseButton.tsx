import clsx from 'clsx';
import React from 'react';
import CloseIcon from '~/v4/icons/Close';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CloseButton.module.css';

type CloseButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  defaultClassName?: string;
  className?: string;
};

export const CloseButton = ({
  pageId = '*',
  imgClassName,
  defaultClassName,
  componentId = '*',
  className,
  ...props
}: CloseButtonProps) => {
  const elementId = 'close_button';
  const { isExcluded, config, uiReference, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      className={clsx(styles.closeButton, className)}
      data-testid={accessibilityId}
    >
      <IconComponent
        configIconName={config.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIcon={() => (
          <CloseIcon className={clsx(styles.closeButton__icon, defaultClassName)} />
        )}
      />
    </Button>
  );
};
