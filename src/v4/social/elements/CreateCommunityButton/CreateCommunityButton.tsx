import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CreateCommunityButton.module.css';

export interface CreateCommunityButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export function CreateCommunityButton({
  pageId = '*',
  componentId = '*',
  onClick,
}: CreateCommunityButtonProps) {
  const elementId = 'create_community_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div
      className={styles.createCommunityButton}
      onClick={() => onClick()}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => <></>}
        imgIcon={() => <img src={config.icon} alt={uiReference} />}
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
      />
      <Typography.Body>{config.text}</Typography.Body>
    </div>
  );
}
