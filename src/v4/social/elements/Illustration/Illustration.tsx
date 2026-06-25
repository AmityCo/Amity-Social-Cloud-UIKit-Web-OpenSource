import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { IllustrationLight, IllustrationDark } from '~/v4/icons/Illustration';

interface IllustrationProps {
  pageId?: string;
  componentId?: string;
}

export const Illustration = ({ pageId = '*', componentId = '*' }: IllustrationProps) => {
  const elementId = 'illustration';
  const {
    currentTheme,
    accessibilityId,
    config,
    defaultConfig,
    isExcluded,
    uiReference,
    themeStyles,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
      imgIcon={() => <img src={config.icon} alt={uiReference} data-testid={accessibilityId} />}
      defaultIcon={() => (
        <div data-testid={accessibilityId}>
          {currentTheme === 'light' ? <IllustrationLight /> : <IllustrationDark />}
        </div>
      )}
    />
  );
};
