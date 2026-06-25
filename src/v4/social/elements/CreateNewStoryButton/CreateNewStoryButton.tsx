import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';

import styles from './CreateNewStoryButton.module.css';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { CreateStoryBadge } from '~/v4/icons/CreateStoryBadge';

type CreateNewStoryProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: () => void;
};

export const CreateNewStoryButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress = () => {},
  isDisabled,
  ...props
}: CreateNewStoryProps) => {
  const elementId = 'create_new_story_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      isDisabled={isDisabled}
      style={themeStyles}
      className={clsx(styles.createNewStoryButton, defaultClassName)}
      data-testid={accessibilityId}
      onPress={onPress}
    >
      <IconComponent
        defaultIcon={() => <CreateStoryBadge />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={clsx(imgClassName)} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
