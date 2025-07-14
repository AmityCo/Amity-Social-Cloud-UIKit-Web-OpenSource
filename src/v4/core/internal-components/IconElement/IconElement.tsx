import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent, IconComponentProps } from '~/v4/core/IconComponent';

interface IconElementProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  imgIconClassName?: string;
  defaultIcon: () => JSX.Element;
}

export function IconElement({
  pageId = '*',
  componentId = '*',
  elementId,
  imgIconClassName,
  defaultIcon,
}: IconElementProps) {
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-testid={accessibilityId}
      defaultIcon={defaultIcon}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
