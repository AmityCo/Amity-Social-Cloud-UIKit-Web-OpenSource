import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button/Button';
import { CreateClip } from '~/v4/icons/CreateClip';
import styles from './CreateClipButton.module.css';

interface CreateClipButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  onClick?: () => void;
}

export function CreateClipButton({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  onClick,
}: CreateClipButtonProps) {
  const elementId = 'create_clip_button';
  const {
    accessibilityId,
    config,
    defaultConfig,
    isExcluded,
    uiReference,
    themeStyles,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      className={styles.createClipButton}
      onPress={() => onClick?.()}
      data-testid={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreateClip className={clsx(styles.createClipButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.BodyBold className={styles.createClipButton__text}>
        {resolveText('amity_social_button_clip')}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreateClipButton;
