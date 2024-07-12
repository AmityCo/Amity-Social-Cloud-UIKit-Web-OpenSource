import clsx from 'clsx';
import millify from 'millify';
import React from 'react';
import { PressEvent } from 'react-aria';
import { Typography } from '~/v4/core/components/index';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './StoryCommentButton.module.css';

const StoryCommentSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="#A5A9B5"
        d="M10 2.188c4.682 0 8.5 3.12 8.5 6.906C18.5 12.912 14.682 16 10 16c-1.295 0-2.49-.232-3.586-.63-.797.663-2.457 1.693-4.648 1.693-.133 0-.2-.034-.266-.133-.033-.1 0-.233.066-.3 0-.032 1.395-1.493 1.827-3.187-1.196-1.195-1.893-2.69-1.893-4.35 0-3.784 3.785-6.905 8.5-6.905z"
      ></path>
    </svg>
  );
};

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
      data-qa-anchor={accessibilityId}
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
            <StoryCommentSvg />
            <Typography.BodyBold>{millify(commentsCount)}</Typography.BodyBold>
          </div>
        )}
      />
    </Button>
  );
};
