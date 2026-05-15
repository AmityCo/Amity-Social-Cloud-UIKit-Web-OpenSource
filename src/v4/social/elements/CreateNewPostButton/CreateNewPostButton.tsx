import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';

type CreateNewPostButtonProps = ButtonProps & {
  pageId: string;
  componentId?: string;
  isValid?: boolean;
  onSubmit?: () => void;
};

export function CreateNewPostButton({
  pageId = '*',
  componentId = '*',
  isValid = false,
  onSubmit,
  ...props
}: CreateNewPostButtonProps) {
  const elementId = 'create_new_post_button';
  const { config, isExcluded, themeStyles, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const label = resolveText('amity_social_button_social_home_create_post_button') || config.text;

  if (isExcluded) return null;

  return (
    <Button {...props} type="submit" style={themeStyles} data-testid={accessibilityId}>
      {label}
    </Button>
  );
}
