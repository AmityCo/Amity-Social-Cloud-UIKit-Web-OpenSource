import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './ShareStoryButton.module.css';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';

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
  community?: Amity.Community | null;
  pageId?: string;
  componentId?: string;
}

export const ShareStoryButton = ({
  pageId = '*',
  componentId = '*',
  community,
  onClick,
}: ShareButtonProps) => {
  const elementId = 'share_story_button';
  const { config, isExcluded, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <button
      role="button"
      className={clsx(styles.shareStoryButton)}
      data-qa-anchor={accessibilityId}
      onClick={onClick}
      data-hideAvatar={config?.hide_avatar}
    >
      {!config?.hide_avatar && (
        <CommunityAvatar pageId={pageId} componentId={componentId} community={community} />
      )}
      <Typography.BodyBold>{config?.text || 'Share story'}</Typography.BodyBold>
      <ArrowRightIcon />
    </button>
  );
};
