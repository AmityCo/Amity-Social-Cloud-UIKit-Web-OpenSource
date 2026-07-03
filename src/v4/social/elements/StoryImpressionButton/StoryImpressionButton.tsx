import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './StoryImpressionButton.module.css';
import { StoryImpression } from '~/v4/icons/StoryImpression';
import millify from 'millify';

interface StoryImpressionButtonButtonProps {
  pageId?: string;
  componentId?: string;
  reach?: number | null;
  defaultIconClassName?: string;
  imgIconClassName?: string;
}

export function StoryImpressionButton({
  pageId = '*',
  componentId = '*',
  reach = 0,
  defaultIconClassName,
  imgIconClassName,
}: StoryImpressionButtonButtonProps) {
  const elementId = 'story_impression_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => (
        <div
          className={clsx(styles.impressionButton, defaultIconClassName)}
          data-testid={accessibilityId}
        >
          <StoryImpression />
          <Typography.BodyBold>{reach}</Typography.BodyBold>
        </div>
      )}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
