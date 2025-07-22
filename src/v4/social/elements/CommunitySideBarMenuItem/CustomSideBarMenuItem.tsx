import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';

interface CustomMenuItemProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  text: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
  onPress: () => void;
  className?: string;
}

export function CustomSideBarMenuItem({
  pageId = '*',
  componentId = '*',
  elementId,
  text,
  icon: IconComp,
  isActive,
  onPress,
  className,
}: CustomMenuItemProps) {
  const { accessibilityId, config, isExcluded, uiReference, defaultConfig, themeStyles } =
    useAmityElement({
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
      icon={(props) => (
        <IconComponent
          configIconName={config?.icon}
          defaultIconName={defaultConfig?.icon}
          defaultIcon={() => <IconComp {...props} />}
          imgIcon={() => <img src={config?.icon} alt={uiReference} />}
        />
      )}
    >
      {config?.text || text}
    </CommunitySideBarMenuItem>
  );
}
