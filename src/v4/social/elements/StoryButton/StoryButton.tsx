import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './StoryButton.module.css';
import { SheetIcon } from '~/v4/core/components/SheetIcon';
import StoryIcon from '~/v4/icons/Story';
import clsx from 'clsx';

type StoryButtonProps = {
  pageId: string;
  onPress?: () => void;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export function StoryButton({
  onPress,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
}: StoryButtonProps) {
  const elementId = 'story_button';
  const { isExcluded, config, accessibilityId, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.storyButton} onPress={onPress}>
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => <SheetIcon className={defaultIconClassName} icon={<StoryIcon />} />}
      />
    </Button>
  );
}
