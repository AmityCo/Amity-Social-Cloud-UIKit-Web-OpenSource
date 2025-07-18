import clsx from 'clsx';
import React from 'react';
import { EllipsisH } from '~/v4/icons/Ellipsis';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './MenuButton.module.css';
import { PressEvent } from 'react-aria';

export type MenuButtonProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  onClick?: (event: PressEvent) => void;
  iconClassName?: string;
  onMouseEnter?: () => void;
};

export function MenuButton({
  onClick,
  className,
  pageId = '*',
  iconClassName,
  componentId = '*',
}: MenuButtonProps) {
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
      onPress={onClick}
      aria-label="Click to open menu"
      data-testid={accessibilityId}
      className={clsx(styles.menuButton__button, className)}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIcon={() => (
          <EllipsisH className={clsx(styles.menuButton, iconClassName)} style={themeStyles} />
        )}
      />
    </Button>
  );
}
