import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { CommunityEmptyGraphic } from '~/v4/icons/CommunityEmptyGraphic';

interface CommunityEmptyImageProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityEmptyImage = ({
  pageId = '*',
  componentId = '*',
}: CommunityEmptyImageProps) => {
  const elementId = 'community_empty_image';

  const { config, accessibilityId, isExcluded, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-testid={accessibilityId}
      defaultIcon={() => <CommunityEmptyGraphic />}
      imgIcon={() => <img src={config.icon} alt={uiReference} />}
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
    />
  );
};
