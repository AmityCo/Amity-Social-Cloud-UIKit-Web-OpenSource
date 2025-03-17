import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreatePostButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button/Button';
import { CreatePost } from '~/v4/icons/CreatePost';

interface CreatePostButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  onClick?: () => void;
}

export function CreatePostButton({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  onClick,
}: CreatePostButtonProps) {
  const elementId = 'create_post_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      className={styles.createPostButton}
      onPress={() => onClick?.()}
      data-testid={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreatePost className={clsx(styles.createPostButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.BodyBold className={styles.createPostButton__text}>
        {config.text}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreatePostButton;
