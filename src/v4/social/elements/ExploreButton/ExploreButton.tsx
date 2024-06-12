import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { TabButton } from '~/v4/social/internal-components/TabButton';

export interface ExploreButtonProps {
  pageId?: string;
  componentId?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function ExploreButton({
  pageId = '*',
  componentId = '*',
  isActive,
  onClick,
}: ExploreButtonProps) {
  const elementId = 'explore_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <TabButton
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      isActive={isActive}
      onClick={() => onClick?.()}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </TabButton>
  );
}
