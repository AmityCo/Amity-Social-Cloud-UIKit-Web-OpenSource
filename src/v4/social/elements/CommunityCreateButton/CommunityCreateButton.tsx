import clsx from 'clsx';
import React from 'react';
import { Plus } from '~/v4/icons/Plus';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './CommunityCreateButton.module.css';

interface CommunityCreateButtonProps {
  pageId?: string;
  componentId?: string;
  isDisabled?: boolean;
  imgClassName?: string;
  defaultClassName?: string;
  onPress?: ButtonProps['onPress'];
}

export const CommunityCreateButton = ({
  onPress,
  isDisabled,
  pageId = '*',
  imgClassName,
  componentId = '*',
  defaultClassName,
}: CommunityCreateButtonProps) => {
  const elementId = 'community_create_button';

  const {
    config,
    accessibilityId,
    themeStyles,
    isExcluded,
    defaultConfig,
    uiReference,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      type="submit"
      onPress={onPress}
      style={themeStyles}
      isDisabled={isDisabled}
      data-testid={accessibilityId}
      className={styles.communityCreateButton__button}
      icon={({ className }) => (
        <IconComponent
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          defaultIcon={() => <Plus className={clsx(className, defaultClassName)} />}
          imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        />
      )}
    >
      {resolveText('amity_social_label_community_setup_create_title')}
    </Button>
  );
};
