import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button';
import styles from './CommunityProfileMenuButton.module.css';
import clsx from 'clsx';
import { EllipsisH } from '~/v4/icons/Ellipsis';

export interface CommunityProfileMenuButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  className?: string;
  defaultClassName?: string;
}

export function CommunityProfileMenuButton({
  pageId = '*',
  componentId = '*',
  onClick,
  className,
  defaultClassName,
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
    <Button className={className} onPress={onClick} data-qa-anchor={accessibilityId}>
      <IconComponent
        defaultIcon={() => (
          <EllipsisH className={clsx(styles.menuButton, defaultClassName)} style={themeStyles} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
