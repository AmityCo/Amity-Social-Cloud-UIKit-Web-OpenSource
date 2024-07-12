import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { TabButton } from '~/v4/social/internal-components/TabButton';

export interface NewsfeedButtonProps {
  pageId?: string;
  componentId?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function NewsfeedButton({
  pageId = '*',
  componentId = '*',
  isActive,
  onClick,
}: NewsfeedButtonProps) {
  const elementId = 'newsfeed_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <TabButton
      data-qa-anchor={accessibilityId}
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      isActive={isActive}
      onPress={() => onClick?.()}
    >
      {config.text}
    </TabButton>
  );
}
