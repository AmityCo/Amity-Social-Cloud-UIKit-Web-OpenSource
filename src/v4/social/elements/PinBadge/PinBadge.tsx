import React from 'react';
import styles from './PinBadge.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { PinBadgeIcon } from '~/v4/icons/PinBadge';

interface PinBadgeProps {
  pageId: string;
  componentId: string;
}

export const PinBadge = ({ pageId, componentId }: PinBadgeProps) => {
  const elementId = 'pin_badge';
  const { config, isExcluded, accessibilityId, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-qa-anchor={accessibilityId}
      defaultIcon={() => <PinBadgeIcon className={styles.pinBadge__icon} />}
      imgIcon={() => <img src={config.icon} alt={uiReference} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
};
