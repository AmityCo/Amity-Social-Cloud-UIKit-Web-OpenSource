import clsx from 'clsx';
import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './LivestreamButton.module.css';
import { LivestreamOutlined } from '~/v4/icons/LivestreamOutlined';

type LivestreamButtonProps = {
  pageId: string;
  onPress?: () => void;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export function LivestreamButton({
  onPress,
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
}: LivestreamButtonProps) {
  const elementId = 'livestream_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <Button
      style={themeStyles}
      className={styles.livestreamButton}
      data-testid={accessibilityId}
      onPress={onPress}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => (
          <LivestreamOutlined
            className={clsx(styles.livestreamButton__icon, defaultIconClassName)}
          />
        )}
      />
      {config.text && (
        <Typography.BodyBold className={styles.livestreamButton__label}>
          {config.text}
        </Typography.BodyBold>
      )}
    </Button>
  );
}
