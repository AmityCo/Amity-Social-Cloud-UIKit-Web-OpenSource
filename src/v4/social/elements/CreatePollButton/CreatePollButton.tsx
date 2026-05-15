import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreatePollButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';
import CreatePoll from '~/v4/icons/CreatePoll';

interface CreatePollButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  defaultClassName?: string;
}

export function CreatePollButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreatePollButtonProps) {
  const elementId = 'create_poll_button';
  const {
    accessibilityId,
    config,
    defaultConfig,
    isExcluded,
    uiReference,
    themeStyles,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button
      className={styles.createPollButton}
      onPress={onClick}
      data-testid={accessibilityId}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <CreatePoll className={clsx(styles.createPollButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.BodyBold className={styles.createPollButton__text}>
        {resolveText('amity_social_button_post_menu_type_poll')}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreatePollButton;
