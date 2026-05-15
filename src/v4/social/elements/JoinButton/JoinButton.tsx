import React from 'react';
import { resolveString } from '~/v4/core/localization';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type JoinButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  textId?: string;
};

export const JoinButton = ({
  pageId = '*',
  componentId = '*',
  elementId: $elementId,
  textId = 'amity_social_accept_button',
  ...props
}: JoinButtonProps) => {
  const elementId = $elementId ? $elementId : 'join_button';
  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      {...props}
      fullWidth
      type="button"
      size="medium"
      variant="fill"
      color="primary"
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {resolveString(textId) || config.text}
    </Button>
  );
};
