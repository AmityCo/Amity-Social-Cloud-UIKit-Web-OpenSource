import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { VerifyBadgeIcon } from '~/v4/icons/VerifyBadge';

interface CommunityVerifyBadgeProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityVerifyBadge = ({
  pageId = '*',
  componentId = '*',
}: CommunityVerifyBadgeProps) => {
  const elementId = 'community_verify_badge';
  const { config, themeStyles, accessibilityId, isExcluded, uiReference, defaultConfig } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-qa-anchor={accessibilityId}
      defaultIcon={() => <VerifyBadgeIcon />}
      imgIcon={() => <img src={config.icon} alt={uiReference} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
};
