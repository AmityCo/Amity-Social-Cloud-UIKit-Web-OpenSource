import clsx from 'clsx';
import React from 'react';
import { VideoIcon } from '~/v4/icons/Video';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './PollButton.module.css';
import { PollIcon } from '~/v4/icons/Poll';

type PollButtonProps = {
  pageId: string;
  onPress?: () => void;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export function PollButton({
  onPress,
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
}: PollButtonProps) {
  const elementId = 'poll_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });
  console.log('🚀 ~ config:', config);

  if (isExcluded) return null;

  return (
    <Button
      style={themeStyles}
      className={styles.pollButton}
      data-testid={accessibilityId}
      onPress={onPress}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => (
          <PollIcon className={clsx(styles.pollButton__icon, defaultIconClassName)} />
        )}
      />
      {config.text && (
        <Typography.BodyBold className={styles.pollButton__label}>
          {config.text}
        </Typography.BodyBold>
      )}
    </Button>
  );
}
