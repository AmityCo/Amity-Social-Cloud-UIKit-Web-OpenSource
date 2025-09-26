import React from 'react';
import { Plus } from '~/v4/icons/Plus';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';

type CreateCommunityMenuItemProps = {
  pageId?: string;
  componentId?: string;
  onPress: () => void;
};

export function CreateCommunityMenuItem({
  onPress,
  pageId = '*',
  componentId = '*',
}: CreateCommunityMenuItemProps) {
  const elementId = 'create_community_sidebar_menu_item';
  const { accessibilityId, config, isExcluded, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <CommunitySideBarMenuItem
      onPress={onPress}
      accessibilityId={accessibilityId}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Plus {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {config.text}
    </CommunitySideBarMenuItem>
  );
}
