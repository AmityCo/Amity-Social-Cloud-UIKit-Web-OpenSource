import clsx from 'clsx';
import React from 'react';
import { Menu } from '~/v4/icons/Menu';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CommunityProfileMenuButton.module.css';

export type CommunityProfileMenuButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
};

export function CommunityProfileMenuButton({
  onPress,
  className,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  ...props
}: CommunityProfileMenuButtonProps) {
  const elementId = 'menu_button';

  const { isExcluded, accessibilityId, themeStyles, config, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      onPress={onPress}
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.menuButton, className)}
      aria-label="Menu icon to open community profile settings page"
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIcon={() => <Menu className={clsx(styles.menuButton__icon, defaultIconClassName)} />}
      />
    </Button>
  );
}
