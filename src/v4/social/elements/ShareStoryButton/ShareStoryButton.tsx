import React from 'react';
import clsx from 'clsx';

import { Avatar, Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';
import Community from '~/v4/icons/Community';
import { AVATAR_SIZE } from '~/v4/core/components/Avatar/Avatar';

import styles from './ShareStoryButton.module.css';

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="14"
      fill="none"
      viewBox="0 0 15 14"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6.813.219c.125-.157.375-.157.53 0l6.532 6.531a.36.36 0 010 .531l-6.531 6.532c-.157.156-.407.156-.532 0l-.625-.594c-.156-.156-.156-.406 0-.531l4.844-4.876H.375A.361.361 0 010 7.438v-.875a.38.38 0 01.375-.375h10.656L6.187 1.345c-.156-.125-.156-.375 0-.532L6.813.22z"
      ></path>
    </svg>
  );
};

interface ShareButtonProps {
  onClick: () => void;
  pageId?: string;
  componentId?: string;
  avatar?: string;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const ShareStoryButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
  avatar,
}: ShareButtonProps) => {
  const elementId = 'share_story_button';

  const { config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <button
      role="button"
      className={clsx(styles.shareStoryButton)}
      data-qa-anchor="share_story_button"
      onClick={onClick}
      data-hideAvatar={config?.hide_avatar}
    >
      {!config?.hide_avatar && (
        <Avatar
          data-qa-anchor="share_story_button_image_view"
          size={AVATAR_SIZE.SMALL}
          avatar={avatar}
          defaultImage={<Community />}
        />
      )}
      <Typography.BodyBold>{config?.text || 'Share story'}</Typography.BodyBold>
      <ArrowRightIcon />
    </button>
  );
};
