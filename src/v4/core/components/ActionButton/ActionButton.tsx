import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'react-aria-components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './ActionButton.module.css';

type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'secondary' | 'tertiary';

export type ActionButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  iconClassName?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  ref?: React.Ref<any>;
  defaultIcon:
    | React.ReactNode
    | ((props: { className?: string; 'data-disabled'?: boolean }) => React.ReactNode);
};

export const ActionButton = forwardRef(function (
  {
    pageId = '*',
    componentId = '*',
    elementId = '*',
    defaultIcon,
    children,
    className,
    iconClassName,
    size = 'medium',
    color = 'primary',
    ...props
  }: ActionButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const iconClasses = clsx(
    styles.icon,
    styles[size], // e.g. .icon.medium
    iconClassName,
  );

  const { accessibilityId, uiReference, themeStyles, config, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const icon = () =>
    typeof defaultIcon === 'function'
      ? defaultIcon({ className: iconClasses, 'data-disabled': props.isDisabled })
      : defaultIcon &&
        React.cloneElement(defaultIcon as React.ReactElement, {
          className: iconClasses,
          'data-disabled': props.isDisabled,
        });

  return (
    <Button
      {...props}
      style={themeStyles}
      data-testid={accessibilityId}
      ref={ref}
      data-icon={!!defaultIcon}
      data-label={!!children}
      className={clsx(styles.button, styles[size], styles[color], className)}
    >
      <IconComponent
        defaultIcon={icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={iconClasses} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
});
