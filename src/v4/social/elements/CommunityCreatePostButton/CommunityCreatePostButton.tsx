import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { CommunityCreatePostButtonIcon } from '~/v4/icons/CommunityCreatePost';

interface CommunityCreatePostButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: ButtonProps['onPress'];
}

export const CommunityCreatePostButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
}: CommunityCreatePostButtonProps) => {
  const elementId = 'community_create_post_button';
  const { config, accessibilityId, themeStyles, isExcluded, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button onPress={onPress}>
      <IconComponent
        defaultIcon={() => <CommunityCreatePostButtonIcon className={defaultClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
