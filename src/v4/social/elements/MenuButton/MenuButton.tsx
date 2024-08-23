import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button';
import styles from './MenuButton.module.css';
import { EllipsisH } from '~/v4/icons/Ellipsis';

export interface MenuButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export function MenuButton({ pageId = '*', componentId = '*', onClick }: MenuButtonProps) {
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
      data-qa-anchor={accessibilityId}
      className={styles.menuButton__button}
    >
      <IconComponent
        defaultIcon={() => <EllipsisH className={styles.menuButton} style={themeStyles} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
