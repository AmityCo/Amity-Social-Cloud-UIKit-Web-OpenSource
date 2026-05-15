import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';

type EditPostButtonProps = ButtonProps & {
  pageId: string;
  componentId?: string;
};

export function EditPostButton({ pageId = '*', componentId = '*', ...props }: EditPostButtonProps) {
  const elementId = 'edit_post_button';
  const { config, isExcluded, themeStyles, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;

  return (
    <Button type="submit" style={themeStyles} data-testid={accessibilityId} {...props}>
      {resolveText('amity_social_button_post_composer_edit_button')}
    </Button>
  );
}
