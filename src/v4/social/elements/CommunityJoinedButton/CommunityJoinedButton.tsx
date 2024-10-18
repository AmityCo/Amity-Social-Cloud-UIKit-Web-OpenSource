import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityJoinedButton.module.css';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components/Typography';
import Check from '~/v4/icons/Check';

interface CommunityJoinedButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  className?: string;
  defaultClassName?: string;
}

export const CommunityJoinedButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
  className,
  defaultClassName,
}: CommunityJoinedButtonProps) => {
  const elementId = 'community_joined_button';
  const { config, themeStyles, accessibilityId, isExcluded, uiReference, defaultConfig } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      onPress={() => onClick?.()}
      className={clsx(styles.communityJoinedButton, className)}
    >
      <IconComponent
        defaultIcon={() => <Check className={clsx(styles.checkButton, defaultClassName)} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />

      <Typography.CaptionBold className={styles.communityJoinedButton__text}>
        {config.text}
      </Typography.CaptionBold>
    </Button>
  );
};
