import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './HyperLinkButton.module.css';
import { HyperLinkCircle } from '~/v4/icons/HyperLinkCircle';

interface HyperLinkButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress: ButtonProps['onPress'];
}

export const HyperLinkButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress = () => {},
}: HyperLinkButtonProps) => {
  const elementId = 'story_hyperlink_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={styles.hyperLinkButton} onPress={onPress} data-testid={accessibilityId}>
      <IconComponent
        defaultIcon={() => (
          <HyperLinkCircle className={clsx(styles.hyperLinkButton, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
