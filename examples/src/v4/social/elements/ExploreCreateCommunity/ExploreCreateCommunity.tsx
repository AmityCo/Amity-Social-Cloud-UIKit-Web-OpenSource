import React from 'react';
import { Plus } from '~/v4/icons/Plus';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/components/AriaButton';

type DescriptionProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
};

export function ExploreCreateCommunity({
  onClick,
  pageId = '*',
  componentId = '*',
}: DescriptionProps) {
  const elementId = 'explore_create_community';

  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      size="medium"
      variant="fill"
      color="primary"
      icon={<Plus />}
      onPress={onClick}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {config.text}
    </Button>
  );
}
