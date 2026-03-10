import React from 'react';
import styles from './PostDeclineButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';

export type PostDeclineButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
};

export const PostDeclineButton = ({
  onClick,
  pageId = '*',
  componentId = '*',
  ...props
}: PostDeclineButtonProps) => {
  const elementId = 'post_decline_button';

  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      size="medium"
      onPress={onClick}
      color="secondary"
      variant="outlined"
      className={styles.postDeclineButton__button}
      {...props}
    >
      <Typography.BodyBold
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.postDeclineButton__text}
      >
        {config?.text ?? 'Decline'}
      </Typography.BodyBold>
    </Button>
  );
};
