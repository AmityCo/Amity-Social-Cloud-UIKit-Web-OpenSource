import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { AspectRatio } from '~/v4/icons/AspectRatio';
import clsx from 'clsx';
import styles from './AspectRatioButton.module.css';

interface AspectRatioButtonProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: ButtonProps['onPress'];
}

export function AspectRatioButton({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: AspectRatioButtonProps) {
  const elementId = 'aspect_ratio_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={styles.aspectRatioButton} data-testid={accessibilityId} onPress={onPress}>
      <IconComponent
        defaultIcon={() => (
          <AspectRatio className={clsx(styles.aspectRatioButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
