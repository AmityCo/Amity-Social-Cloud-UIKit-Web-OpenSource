import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import Brand from '~/v4/icons/Brand';
import styles from './BrandBadge.module.css';
import clsx from 'clsx';

interface BrandBadgeProps {
  pageId?: string;
  componentId?: string;
  className?: string;
}

export const BrandBadge = ({ pageId = '*', componentId = '*', className }: BrandBadgeProps) => {
  const elementId = 'brand_badge';

  const { config, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <IconComponent
      defaultIcon={() => <Brand className={clsx(className, styles.brandBadge)} />}
      imgIcon={() => <img src={config.image} alt={uiReference} className={className} />}
      defaultIconName={defaultConfig.image}
      configIconName={config.image}
    />
  );
};
