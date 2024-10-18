import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { ArrowRight } from '~/v4/icons/ArrowRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import styles from './ShareStoryButton.module.css';

interface ShareButtonProps {
  pageId?: string;
  onClick: () => void;
  componentId?: string;
  community?: Amity.Community | null;
}

export const ShareStoryButton = ({
  onClick,
  community,
  pageId = '*',
  componentId = '*',
}: ShareButtonProps) => {
  const elementId = 'share_story_button';
  const { config, isExcluded, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      onPress={onClick}
      data-testid={accessibilityId}
      data-hideAvatar={config?.hide_avatar}
      className={clsx(styles.shareStoryButton)}
    >
      {!config?.hide_avatar && (
        <CommunityAvatar
          pageId={pageId}
          community={community}
          componentId={componentId}
          className={styles.shareStoryButton__image}
        />
      )}
      <Typography.BodyBold>{config?.text || 'Share story'}</Typography.BodyBold>
      <ArrowRight className={styles.shareStoryButton__icon} />
    </Button>
  );
};
