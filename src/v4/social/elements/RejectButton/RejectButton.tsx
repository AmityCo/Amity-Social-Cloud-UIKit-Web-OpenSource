import React from 'react';
import { resolveString } from '~/v4/core/localization';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type RejectButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  textId?: string;
};

export const RejectButton = ({
  pageId = '*',
  componentId = '*',
  elementId: $elementId,
  textId = 'amity_social_button_decline',
  ...props
}: RejectButtonProps) => {
  const elementId = $elementId ? $elementId : 'reject_button';
  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      {...props}
      fullWidth
      size="medium"
      type="button"
      color="secondary"
      variant="outlined"
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {resolveString(textId) || config.text}
    </Button>
  );
};
