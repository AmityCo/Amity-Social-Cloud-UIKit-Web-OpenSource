import React, { useState } from 'react';
import clsx from 'clsx';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import Muted from '~/v4/icons/MutedFilled';
import UnMuted from '~/v4/icons/UnMuted';
import styles from './MuteButton.module.css';

type MuteButtonProps = {
  pageId?: string;
  componentId?: string;
  isMuted?: boolean;
  buttonClassName?: string;
  defaultClassName?: string;
  imgClassName?: string;
  handleMuteToggle: (isMuted: boolean) => void;
  isLocalMuted?: boolean;
  enableMuteToggle?: boolean;
};

export const MuteButton = ({
  pageId = '*',
  componentId = '*',
  isMuted,
  buttonClassName,
  defaultClassName,
  imgClassName,
  handleMuteToggle,
  isLocalMuted,
  enableMuteToggle = false,
}: MuteButtonProps) => {
  const elementId = 'mute_button';

  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  const onClickMuted = () => {
    if (isMuted && !enableMuteToggle) return;

    handleMuteToggle(!isLocalMuted || !isMuted);
  };

  return (
    <Button
      data-testid={accessibilityId}
      style={themeStyles}
      variant="text"
      className={clsx(styles.muteButton__button, buttonClassName)}
      onPress={onClickMuted}
      isDisabled={isMuted && !enableMuteToggle}
    >
      <IconComponent
        data-testid={accessibilityId}
        defaultIcon={
          isMuted || isLocalMuted
            ? () => <UnMuted className={clsx(styles.muteButton__icon, defaultClassName)} />
            : () => <Muted className={clsx(styles.muteButton__icon, defaultClassName)} />
        }
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
