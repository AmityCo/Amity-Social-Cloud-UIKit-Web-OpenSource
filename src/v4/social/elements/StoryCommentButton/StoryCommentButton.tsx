import clsx from 'clsx';
import millify from 'millify';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './StoryCommentButton.module.css';
import { StoryComment } from '~/v4/icons/StoryComment';

interface StoryCommentButtonProps {
  commentsCount: number;
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  onPress: ButtonProps['onPress'];
}

export const StoryCommentButton = ({
  pageId = '*',
  componentId = '*',
  onPress,
  commentsCount,
  imgClassName,
}: StoryCommentButtonProps) => {
  const elementId = 'story_comment_button';
  const { isExcluded, accessibilityId, defaultConfig, config, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      data-testid={accessibilityId}
      onPress={onPress}
      style={themeStyles}
      className={clsx(styles.storyCommentButton)}
    >
      <IconComponent
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
        imgIcon={() => (
          <img
            src={config.icon}
            alt={uiReference}
            className={clsx(imgClassName)}
            style={themeStyles}
          />
        )}
        defaultIcon={() => (
          <div className={clsx(styles.storyCommentIcon)}>
            <StoryComment />
            <Typography.BodyBold>{millify(commentsCount)}</Typography.BodyBold>
          </div>
        )}
      />
    </Button>
  );
};
