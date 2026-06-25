import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { ExploreEmptyLight, ExploreEmptyDark } from '~/v4/icons/ExploreEmptyImage';

interface ExploreEmptyImageProps {
  pageId?: string;
  componentId?: string;
}

export const ExploreEmptyImage = ({ pageId = '*', componentId = '*' }: ExploreEmptyImageProps) => {
  const elementId = 'explore_empty_image';
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
      imgIcon={() => (
        <img
          style={themeStyles}
          src={config.icon}
          alt={uiReference}
          data-testid={accessibilityId}
        />
      )}
      defaultIcon={() => (
        <div data-testid={accessibilityId} style={themeStyles}>
          {currentTheme === 'light' ? <ExploreEmptyLight /> : <ExploreEmptyDark />}
        </div>
      )}
    />
  );
};
