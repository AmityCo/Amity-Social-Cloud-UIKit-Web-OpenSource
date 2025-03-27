import React from 'react';
import styles from './PostAcceptButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';

export type PostAcceptButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
};

export const PostAcceptButton = ({
  onClick,
  pageId = '*',
  componentId = '*',
  ...props
}: PostAcceptButtonProps) => {
  const elementId = 'post_accept_button';

  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button
      size="medium"
      variant="fill"
      onPress={onClick}
      className={styles.postAcceptButton__button}
      {...props}
    >
      <Typography.BodyBold
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.postAcceptButton__text}
      >
        {config?.text}
      </Typography.BodyBold>
    </Button>
  );
};
