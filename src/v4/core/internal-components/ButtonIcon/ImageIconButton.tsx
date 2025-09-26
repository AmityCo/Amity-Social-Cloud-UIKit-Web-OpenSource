import React from 'react';

import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { IconComponent } from '~/v4/core/IconComponent';

export interface ImageIconButtonProps extends ButtonProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  imageIconClassName?: string;
  defaultIcon: () => JSX.Element;
}

export function ImageIconButton({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  imageIconClassName,
  defaultIcon,
  ...props
}: ImageIconButtonProps) {
  const { accessibilityId, config, defaultConfig, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button variant="text" data-testid={accessibilityId} {...props}>
      <IconComponent
        defaultIcon={defaultIcon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imageIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
