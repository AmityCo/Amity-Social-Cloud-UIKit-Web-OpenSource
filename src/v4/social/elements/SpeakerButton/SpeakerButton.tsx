import React from 'react';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './SpeakerButton.module.css';
import { SpeakerMute } from '~/v4/icons/SpeakerMute';
import { SpeakerUnmute } from '~/v4/icons/SpeakerUnmute';

interface SpeakerButtonProps {
  isMuted: boolean;
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: ButtonProps['onPress'];
}

export function SpeakerButton({
  isMuted,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: SpeakerButtonProps) {
  const elementId = 'speaker_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={clsx(styles.speakerButton)} onPress={onPress}>
      <IconComponent
        data-testid={accessibilityId}
        defaultIcon={() =>
          isMuted ? (
            <SpeakerUnmute className={styles.speakerButton__icon} />
          ) : (
            <SpeakerMute className={styles.speakerButton__icon} />
          )
        }
        imgIcon={() => (
          <img src={config.icon} alt={uiReference} className={clsx(imgIconClassName)} />
        )}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
