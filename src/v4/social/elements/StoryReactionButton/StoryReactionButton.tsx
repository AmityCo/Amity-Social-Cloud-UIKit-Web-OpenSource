import React from 'react';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './StoryReactionButton.module.css';
import { StoryReaction } from '~/v4/icons/StoryReaction';
import { StoryMyReaction } from '~/v4/icons/StoryMyReaction';
import { Typography } from '~/v4/core/components';
import millify from 'millify';

interface StoryReactionButtonProps {
  myReactions?: string[];
  reactionsCount: number;
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: () => void;
}

export const StoryReactionButton = ({
  myReactions = [],
  reactionsCount,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: StoryReactionButtonProps) => {
  const elementId = 'story_reaction_button';
  const { isExcluded, accessibilityId, config, uiReference, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const hasMyReactions = myReactions.length > 0;

  if (isExcluded) return null;

  return (
    <Button
      data-testid={accessibilityId}
      className={clsx(styles.storyReactionButton)}
      onPress={onPress}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <div className={clsx(styles.storyReactionIcon, defaultIconClassName)}>
            {hasMyReactions ? <StoryMyReaction /> : <StoryReaction />}
            <Typography.BodyBold>{millify(reactionsCount)}</Typography.BodyBold>
          </div>
        )}
        imgIcon={() => (
          <img src={config.icon} alt={uiReference} className={clsx(imgIconClassName)} />
        )}
      />
    </Button>
  );
};
