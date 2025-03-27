import clsx from 'clsx';
import React from 'react';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button/Button';
import styles from './BackButton.module.css';

type BackButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  defaultClassName?: string;
};

export const BackButton = ({
  onPress,
  className,
  pageId = '*',
  imgClassName,
  defaultClassName,
  componentId = '*',
  ...props
}: BackButtonProps) => {
  const elementId = 'back_button';

  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      elementId,
      componentId,
    });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      onPress={onPress}
      style={themeStyles}
      data-testid={accessibilityId}
      aria-label="Back to the previous page"
      className={clsx(styles.backButton, className)}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIcon={() => (
          <ArrowLeft className={clsx(styles.backButton__icon, defaultClassName)} />
        )}
      />
    </Button>
  );
};
