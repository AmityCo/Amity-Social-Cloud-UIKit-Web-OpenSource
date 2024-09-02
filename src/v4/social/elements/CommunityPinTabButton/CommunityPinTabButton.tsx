import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityPinTabButtonProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityPinTabButton = ({
  pageId = '*',
  componentId = '*',
}: CommunityPinTabButtonProps) => {
  const elementId = 'community_pin_tab_button';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles}>
      CommunityPinTabButton
    </div>
  );
};
