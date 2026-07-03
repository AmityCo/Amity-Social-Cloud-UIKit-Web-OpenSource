import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './OverflowMenuButton.module.css';
import { OverflowMenu } from '~/v4/icons/OverflowMenu';

interface OverflowMenuButtonProps {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
  defaultClassName?: string;
  imgClassName?: string;
  'data-testid'?: string;
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
      data-testid={accessibilityId}
      className={styles.overflowMenuButton}
      onPress={onPress}
    >
      <IconComponent
        defaultIcon={() => <OverflowMenu className={defaultClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
