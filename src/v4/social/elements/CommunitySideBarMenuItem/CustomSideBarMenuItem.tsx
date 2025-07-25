import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { Icon, IconProps } from '~/v4/core/components/Icon/Icon';

interface CustomMenuItemProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  text: string;
  icon?: IconProps['name'];
  isActive?: boolean;
  onPress: () => void;
  className?: string;
}

export function CustomSideBarMenuItem({
  pageId = '*',
  componentId = '*',
  elementId,
  text,
  icon,
  isActive,
  onPress,
  className,
}: CustomMenuItemProps) {
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <CommunitySideBarMenuItem
      onPress={onPress}
      isActive={isActive}
      className={className}
      accessibilityId={accessibilityId}
      themeStyles={themeStyles}
      icon={icon ? (iconProps) => <Icon name={icon} {...iconProps} /> : undefined}
    >
      {config?.text || text}
    </CommunitySideBarMenuItem>
  );
}
