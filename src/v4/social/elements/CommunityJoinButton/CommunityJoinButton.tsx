import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityJoinButton.module.css';
import { IconComponent } from '~/v4/core/IconComponent';
import { Plus as PlusIcon } from '~/v4/icons/Plus';
import clsx from 'clsx';

interface CommunityJoinButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  className?: string;
  defaultClassName?: string;
}

export const CommunityJoinButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
  className,
  defaultClassName,
}: CommunityJoinButtonProps) => {
  const elementId = 'community_join_button';
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
      onPress={onClick}
      className={clsx(styles.communityJoinButton, className)}
    >
      <IconComponent
        defaultIcon={() => <PlusIcon className={clsx(styles.joinButton, defaultClassName)} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      Join
    </Button>
  );
};
