import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';

type InviteButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
};

export function InviteButton({ pageId = '*', componentId = '*', ...props }: InviteButtonProps) {
  const elementId = 'invite_button';
  const { config, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Button
      size="medium"
      type="button"
      variant="fill"
      color="primary"
      data-testid={accessibilityId}
      {...props}
    >
      {config.text ?? 'Invite'}
    </Button>
  );
}
